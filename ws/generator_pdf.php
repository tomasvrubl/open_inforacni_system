<?php 


require_once __DIR__.'/library.php';
require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../vendor/simple_html_dom.php';

use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;

\ws\Bootstrap\ProxyContainer::$neons = [ __DIR__ . '/config.neon'];
\ws\Bootstrap\ProxyContainer::$temp =  __DIR__ . '/temp' ;

$container = new \ws\Bootstrap\ProxyContainer();
$parameters = $container->getParameters();

\dibi::connect($parameters['dibi']);


//Settings::setPdfRendererName(Settings::PDF_RENDERER_DOMPDF);
Settings::setPdfRendererPath('.');


class TemplateProcessorReport extends TemplateProcessor {

        
        public const NONE = 0;
        public const CHECKBOX = 1;
        public const TEXTBOX = 2;

        public function __construct($documentTemplate)
        {
                parent::__construct($documentTemplate);
        }

        public function getDocumentMainPart() {
                return $this->tempDocumentMainPart;
        }

        public function getDocumentSettingsPart() {
                return $this->tempDocumentSettingsPart;
        }

        public function getDocumentContentTypesPart() {
                return $this->tempDocumentContentTypes;
        }


        public function getBlockValue($blockname=""){                
                $matches = array();
                
                $bb = str_replace(".", "\.", $blockname);
                $bb = '/\${'.$bb.'}.*\${\/'.$bb.'}/is';

                preg_match($bb, $this->tempDocumentMainPart, $matches);
                
                $m = [];
                foreach($matches as $val){
                        $val = strip_tags($val);
                        $z = strpos($val, "}")+1;

                        $m[] = trim(substr($val, $z, strrpos($val, "$")-$z));
                }

                return $m;
        }

        public function cloneRowAndSetValues($search, $values)
        {
            $this->cloneRow($search, count($values));
    
            foreach ($values as $rowKey => $rowData) {
                $rowNumber = $rowKey + 1;
                foreach ($rowData as $macro => $replace) {
                    $this->setValue($macro . '#' . $rowNumber, $replace);
                }
            }
        }

        public function cloneRow($search, $numberOfClones)
        {
            $search = static::ensureMacroCompleted($search);
    
            $tagPos = strpos($this->tempDocumentMainPart, $search);
            if (!$tagPos) {
                throw new Exception('Can not clone row, template variable not found or variable contains markup.');
            }
    
            $rowStart = $this->findRowStart($tagPos);
            $rowEnd = $this->findRowEnd($tagPos);
            $xmlRow = $this->getSlice($rowStart, $rowEnd);
    
            // Check if there's a cell spanning multiple rows.
            if (preg_match('#<w:vMerge w:val="restart"/>#', $xmlRow)) {
                // $extraRowStart = $rowEnd;
                $extraRowEnd = $rowEnd;
                while (true) {
                    $extraRowStart = $this->findRowStart($extraRowEnd + 1);
                    $extraRowEnd = $this->findRowEnd($extraRowEnd + 1);
    
                    // If extraRowEnd is lower then 7, there was no next row found.
                    if ($extraRowEnd < 7) {
                        break;
                    }
    
                    // If tmpXmlRow doesn't contain continue, this row is no longer part of the spanned row.
                    $tmpXmlRow = $this->getSlice($extraRowStart, $extraRowEnd);
                    if (!preg_match('#<w:vMerge/>#', $tmpXmlRow) &&
                        !preg_match('#<w:vMerge w:val="continue"\s*/>#', $tmpXmlRow)
                    ) {
                        break;
                    }
                    // This row was a spanned row, update $rowEnd and search for the next row.
                    $rowEnd = $extraRowEnd;
                }
                $xmlRow = $this->getSlice($rowStart, $rowEnd);
            }
    
            $result = $this->getSlice(0, $rowStart);
            $result .= implode($this->indexClonedVariables($numberOfClones, $xmlRow));
            $result .= $this->getSlice($rowEnd);
    
            $this->tempDocumentMainPart = $result;
        }

        protected function indexClonedVariables($count, $xmlBlock)
        {
            $results = array();
            for ($i = 1; $i <= $count; $i++) {
                $txt = preg_replace('/\$\{([^:]*?)(:.*?)?\}/', '\${\1#' . $i . '\2}', $xmlBlock);
                
                
                $txt = preg_replace('/<w:bookmarkStart w:id="([0-9]+)" w:name="([^_].+?)"\/>/', '<w:bookmarkStart w:id="\1" w:name="\2#'.$i.'"/>', $txt);
                $txt = preg_replace('/<w:name w:val="(.+?)"\/>/', '<w:name w:val="\1#' . $i . '"/>', $txt);

                $results[] = $txt;
            }
    
            return $results;
        }



        public function getElements() {
                $result = [];

                $dom = str_get_html($this->getDocumentMainPart());

                foreach($dom->find("w:ffData") as $c){
                        
                      
                        $el = $c->getElementByTagName("w:name");
                
                        if($el !== NULL){
                           $name = trim($el->getAttribute("w:val"));
                
                           $e = explode("_", $name);
                           if(count($e) < 2){
                                $e = array("", $name);
                           }
                           
                           $clmn = trim(ltrim($name, $e[0]."_"));
                           if($c->getElementByTagName("w:checkBox") != NULL){                                                                
                                $result[$e[0]][] = array($clmn, TemplateProcessorReport::CHECKBOX);
                           }
                           else if($c->getElementByTagName("w:textInput") != NULL){                                
                                $result[$e[0]][] = array($clmn, TemplateProcessorReport::TEXTBOX);
                           }                           
                           
                        }
                       
                }
                
                return $result;
        }


        public function dropBlock($blockname=""){
                $matches = array();
                
                $bb = str_replace(".", "\.", $blockname);
                $bb = '/\${'.$bb.'}.*\${\/'.$bb.'}/is';


                preg_match($bb, $this->tempDocumentMainPart, $matches, PREG_OFFSET_CAPTURE);
            

                while(count($matches) > 0){

                    $firstPart = substr($this->tempDocumentMainPart, 0, $matches[0][1]);
                    $firstPart = substr($firstPart, 0, strripos($firstPart, "<w:p>"));


                    $lastPart = substr($this->tempDocumentMainPart,  $matches[0][1]+strlen($matches[0][0]));
                    $lastPart = substr($lastPart, strpos($lastPart, "</w:p>")+strlen("</w:p>"));

                    $this->tempDocumentMainPart =  $firstPart.$lastPart;

                    preg_match($bb, $this->tempDocumentMainPart, $matches, PREG_OFFSET_CAPTURE);
                }
        }

        public function setValue($search, $replace=array(), $limit = self::MAXIMUM_REPLACEMENTS_DEFAULT)
        {
        
            $search = static::ensureMacroCompleted($search);
            $val = static::ensureUtf8Encoded($replace[0]);
    
            
            if($replace[1] == TemplateProcessorReport::CHECKBOX){
                $search = substr($search, 2, -1);
                $this->tempDocumentMainPart = $this->setValueForCheckbox($search, intval($val), $this->tempDocumentMainPart);         
                return;
            }
            else if($replace[1] == TemplateProcessorReport::TEXTBOX){
                $search = substr($search, 2, -1);
                $this->tempDocumentMainPart = $this->setValueForTextbox($search, $val, $this->tempDocumentMainPart);         
                return;
            }

            
            $this->tempDocumentHeaders = $this->setValueForPart($search, $val, $this->tempDocumentHeaders, $limit);
            $this->tempDocumentMainPart = $this->setValueForPart($search, $val, $this->tempDocumentMainPart, $limit);
            $this->tempDocumentFooters = $this->setValueForPart($search, $val, $this->tempDocumentFooters, $limit);


        }


        protected function setValueForCheckbox($search, $checked=0, $documentPartXML)
        {
            $n_name = str_replace("#", "_", $search);
            $pattern = '<w:name w:val="'.$n_name.'"/><w:enabled/><w:calcOnExit w:val="0"/><w:checkBox><w:sizeAuto/><w:default w:val="'.$checked.'"/><w:checked w:val="'.$checked.'"/></w:checkBox>';
            $documentPartXML = preg_replace('/<w:name w:val="'.$search.'"\/>.+?<\/w:checkBox>/', $pattern, $documentPartXML);
            
            return preg_replace('/w:name="'.$search.'"/', 'w:name="'.$n_name.'"', $documentPartXML);
        }


        protected function setValueForTextbox($search, $replace, $documentPartXML)
        {            
            $n_name = str_replace("#", "_", $search);
            
            
            $f = preg_match('/<w:bookmarkStart w:id="[0-9]+" w:name="'.$search.'"\/>((\s|\S)+?)<w:bookmarkEnd/', $documentPartXML, $matches, PREG_OFFSET_CAPTURE);
            
            if($f && isset($matches[1])){
                $startpos = $matches[1][1];
                $f2 = preg_match('/<w:t>(.*)<\/w:t>/', $matches[1][0], $matches2, PREG_OFFSET_CAPTURE);

                if($f2){
                    $part1 = substr($documentPartXML, 0, $startpos+$matches2[1][1]);
                    $part2 = substr($documentPartXML, $startpos+$matches2[1][1]+strlen($matches2[1][0]));                    
                    $documentPartXML = $part1."".$replace."".$part2;
                }

            }

            $documentPartXML = preg_replace('/w:val="'.$search.'"/', 'w:val="'.$n_name.'"', $documentPartXML);
            return preg_replace('/w:name="'.$search.'"/', 'w:name="'.$n_name.'"', $documentPartXML);
        }


}


$t = new TemplateProcessorReport(__DIR__.'/formular-zdravotni-prohlidka-doktor.docx');
$varlist = $t->getVariables();
$forms = $t->getElements();

echo "ALL: \r\n";
print_r($varlist);
print_r($forms);


$rec_id = 6;
$osoba = "Vrubl Tomas";
$dnes = date("d.m.Y H:i:s");


$blocks = [];
$var = [];
$sql = [];

//rozdel na sql, bloky, promene
foreach($varlist as $b){
        if($b[0] == '/'){
                $x = ltrim($b, '/');
                
                if(startsWith($x, "sql")){                
                    $sql[] = $x;
                    continue;
                }

                $blocks[] = $x;
        }
        else{
                if(strcasecmp($b, "%uzivatel") == 0){
                    $t->setValue($b, array($osoba, TemplateProcessorReport::NONE));
                }
                else if(strcasecmp($b, "%dnes") == 0){
                    $t->setValue($b, array($dnes, TemplateProcessorReport::NONE));
                }
                else{
                    $var[] = $b;
                }                
        }
}

$var = array_values(array_diff($var, $blocks, $sql));

$tmp = [];

for($i=0; $i < count($var); ++$i){

        $e = explode("_", $var[$i]);
        if(count($e) > 1){
            $tmp[$e[0]][] = substr($var[$i], strlen($e[0])+1);
        }
        else{
            $tmp[""][] = $var[$i];
        }
}

$var = $tmp;


//zpracuj sql
$tmp = [];
for($i=0; $i < count($sql); ++$i){
        $e = explode(".", $sql[$i]);

        if(count($e) > 1){
            $tmp[$e[1]] = $t->getBlockValue($sql[$i]);
        }
        else{
             $tmp[""] = $t->getBlockValue($sql[$i]);
        }
}

$sql = $tmp;




foreach($sql as $key=>$s){

        $s[0] = str_ireplace("&apos;", "'", $s[0]);
        $s[0] = str_ireplace("%id", $rec_id, $s[0]);
        $s[0] = str_ireplace("\"", "'", $s[0]);
        $s[0] = str_ireplace("”", "'", $s[0]);
        $s[0] = str_ireplace("`", "'", $s[0]);
        

        $dt = dibi::query(strtolower($s[0]))->fetchAll();

        if(count($dt) > 1){

             $ar = [];             
             foreach($dt as $d){

                $a = [];
                foreach($var[$key] as $v){  //zpracovani klasickych promenych
                     $a[$key."_".$v] = array($d[strtolower($v)], TemplateProcessorReport::NONE);
                }

                foreach($forms[$key] as $v){  //zpracovani formularovych prvku 
                     $a[$key."_".$v[0]] = array($d[strtolower($v[0])], $v[1]);
                }

                $ar[] = $a;
             }

             $t->cloneRowAndSetValues($key."_".$var[$key][0], $ar);
        }
        else if(count($dt) == 1) {                
             $dt = $dt[0];

             if(key_exists($key, $var)){
                foreach($var[$key] as $v){
                    $t->setValue($key."_".$v, array($dt[strtolower($v)], TemplateProcessorReport::NONE));
                }
            }                        

            if(key_exists($key, $forms)){ 
                foreach($forms[$key] as $v){  //zpracovani formularovych prvku 
                     $t->setValue($key."_".$v[0], array($dt[strtolower($v[0])], $v[1]));
                 }
             }

        }

}

foreach($sql as $key => $s){        
        if(strlen($key) > 0){
            $t->dropBlock("sql.".$key);
        }
        else{
            $t->dropBlock("sql");
        }
}


$outf = "./out.docx";
$t->saveAs($outf);

