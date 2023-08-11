<?php

namespace ws\Bootstrap;

class Response extends \Nette\Http\Response
{
    public function __construct() {
        parent::__construct();
        if (PHP_SAPI === 'cli') {

        } elseif (headers_sent($file, $line)) {
                throw new Nette\InvalidStateException('Cannot send header after HTTP headers have been sent' . ($file ? " (output started at $file:$line)." : '.'));

        } elseif ($this->warnOnBuffer && ob_get_length() && !array_filter(ob_get_status(TRUE), function ($i) { return !$i['chunk_size']; })) {
                trigger_error('Possible problem: you are sending a HTTP header while already having some data in output buffer. Try Tracy\OutputDebugger or start session earlier.');
        }
    }
}