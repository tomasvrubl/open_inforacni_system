<?php

namespace ws\Responses;



use Nette\Http\Request;

abstract class Response
{
    public abstract  function render(Request $request, \Nette\Http\Response $response);
}