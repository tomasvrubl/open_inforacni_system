<?php

namespace ws\Responses;

use Nette\Http\Request;

class JsonResponse extends Response
{
    protected $payload;

    public function __construct($data)
    {
        $this->payload = $data;
    }

    public function render(Request $request,\Nette\Http\Response $response)
    {
        $response->setContentType('application/json');
        $response->setCode(200);
        echo json_encode($this->payload);
    }
}