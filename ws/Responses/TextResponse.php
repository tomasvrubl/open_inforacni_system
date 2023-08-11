<?php


namespace ws\Responses;

use Nette\Http\Request;

class TextResponse extends Response
{
    protected  $content;
    public function __construct($content)
    {
        $this->content = $content;
    }


    public function render(Request $request, \Nette\Http\Response $response)
    {
        echo $this->content;
    }
}