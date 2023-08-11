<?php

namespace ws\Bootstrap;

use Dibi\Exception;
use Nette\DI\Container;
use Nette\Http\Request;
use Nette\Http\Response;
use Tracy\Debugger;
use ws\Exceptions\RedirectException;
use ws\Exceptions\SecurityException;
use ws\Exceptions\ContentException;

/**
 * Class Crontrollers
 * @package ws\Bootstrap
 * @property Request request
 * @property Response response
 * @property Container container
 */
class Controllers
{
    /**
     * @var Request
     */
    public $request;


    /**
     * @var Container
     */
    public $container;

    /**
     * @var Response
     */
    public $response;


    protected $names;

    public function __construct($names)
    {
        $this->names = $names;
    }

    public function run()
    {
        try {
            $query = [];

            $headers = $this->request->getHeaders();
            if ($this->request->getHeader('content-type') == 'application/json') {
                $rawBody = $this->request->getRawBody();
                $json = @json_decode($rawBody, true);
                if ($json) {
                    $query += $json;
                }
            }

            $query += $this->request->getPost() + $this->request->getQuery();
            
            if (!isset($query['controller']) && !$query) {
                return;
                //throw new SecurityException('No controller defined in request');
            }

            @list($class, $method) = explode('::', $query['controller']);

            $controller = new ProxyController($class, $method, $this->container);

            $retData = $controller();
            if (is_scalar($retData)) {
                $this->response->setCode(200);
                $this->response->setContentType('application/json');
                echo json_encode($retData);
            } else if ($retData instanceof Response) {
                $retData->render($this->request, $this->response);
            } else {
                $this->response->setCode(200);
                $this->response->setContentType('application/json');
                echo json_encode($retData);
            }

        } catch (SecurityException $ex) {
            $this->response->setCode($ex->getCode() ?: 401);
            $this->response->setContentType('application/json');
            echo json_encode(array('error' => $ex->getMessage()));
        } catch (RedirectException $ex) {
            $this->response->setCode($ex->getCode() ?: 503);
            $this->response->setContentType('application/json');
            echo json_encode(['redirect' => $ex->getMessage()]);
        } catch (Exception $ex) {

            $this->response->setCode(503);
            $this->response->setContentType('application/json');
            Debugger::log($ex, Debugger::EXCEPTION);
            echo json_encode(array('error' => $ex->getMessage()));
        }
    }

}