<?php
// source: /var/www/html/gis/generator/../ws/config.neon 

class Container_182bef0ab7 extends Nette\DI\Container
{
	protected $meta = [
		'types' => [
			'Nette\Http\RequestFactory' => [1 => ['http.requestFactory']],
			'Nette\Http\IRequest' => [1 => ['http.request']],
			'Nette\Http\Request' => [1 => ['http.request']],
			'Nette\Http\Response' => [1 => ['http.response']],
			'Nette\Http\IResponse' => [1 => ['http.response']],
			'ws\Bootstrap\Response' => [1 => ['http.response']],
			'Nette\Http\Context' => [1 => ['http.context']],
			'Tracy\ILogger' => [1 => ['tracy.logger']],
			'Tracy\BlueScreen' => [1 => ['tracy.blueScreen']],
			'Tracy\Bar' => [1 => ['tracy.bar']],
			'Nette\Security\Passwords' => [1 => ['security.passwords']],
			'Nette\Security\IUserStorage' => [1 => ['security.userStorage']],
			'Nette\Security\User' => [1 => ['security.user']],
			'Nette\Http\Session' => [1 => ['session.session']],
			'ws\BaseController' => [1 => ['controllers.user']],
			'ws\Security\UserController' => [1 => ['controllers.user']],
			'ws\Bootstrap\ProxyController' => [
				1 => [
					'controllers.user.login',
					'controllers.user.logout',
					'controllers.user.isLoggedIn',
					'controllers.cestak.showList',
					'controllers.cestak.saveList',
					'controllers.auta.autoList',
					'controllers.auta.autoUser',
					'controllers.auta.autoAdd',
					'controllers.auta.autoDrop',
				],
			],
			'ws\Security\UserRoleController' => [1 => ['controllers.userrole']],
			'ws\Cestak\CestakController' => [1 => ['controllers.cestak']],
			'ws\Cestak\AutaController' => [1 => ['controllers.auta']],
			'ws\Ciselnik\PracovisteController' => [1 => ['controllers.pracoviste']],
			'ws\Ciselnik\OsobaController' => [1 => ['controllers.osoba']],
			'ws\Ciselnik\ZdrojController' => [1 => ['controllers.zdroj']],
			'ws\Ciselnik\KalendarController' => [1 => ['controllers.kalendar']],
			'ws\Ciselnik\JednotkaController' => [1 => ['controllers.jednotka']],
			'ws\Pomocne\TableHelper' => [1 => ['controllers.plan']],
			'ws\Vyroba\PlanController' => [1 => ['controllers.plan']],
			'ws\Pomocne\CommonController' => [1 => ['controllers.setting']],
			'ws\Ciselnik\SkladController' => [1 => ['controllers.sklad']],
			'ws\Tavirna\TavirnaController' => [1 => ['controllers.tavirna']],
			'ws\Person\OdmenaController' => [1 => ['controllers.odmena']],
			'ws\Bootstrap\Controllers' => [1 => ['controllers']],
			'ws\Responses\Responses' => [1 => ['responses']],
			'Symfony\Component\Console\Command\Command' => [1 => ['commands.0']],
			'ws\Security\CreateAdminCommand' => [1 => ['commands.0']],
			'Nette\Security\IAuthenticator' => [1 => ['authenticator']],
			'ws\Security\Authenticator' => [1 => ['authenticator']],
			'Nette\Security\Permission' => [1 => ['authorizator']],
			'Nette\Security\IAuthorizator' => [1 => ['authorizator']],
			'ws\Security\Authorizator' => [1 => ['authorizator']],
			'Nette\DI\Container' => [1 => ['container']],
		],
		'services' => [
			'authenticator' => 'ws\Security\Authenticator',
			'authorizator' => 'ws\Security\Authorizator',
			'commands.0' => 'ws\Security\CreateAdminCommand',
			'container' => 'Nette\DI\Container',
			'controllers' => 'ws\Bootstrap\Controllers',
			'controllers.auta' => 'ws\Cestak\AutaController',
			'controllers.auta.autoAdd' => 'ws\Bootstrap\ProxyController',
			'controllers.auta.autoDrop' => 'ws\Bootstrap\ProxyController',
			'controllers.auta.autoList' => 'ws\Bootstrap\ProxyController',
			'controllers.auta.autoUser' => 'ws\Bootstrap\ProxyController',
			'controllers.cestak' => 'ws\Cestak\CestakController',
			'controllers.cestak.saveList' => 'ws\Bootstrap\ProxyController',
			'controllers.cestak.showList' => 'ws\Bootstrap\ProxyController',
			'controllers.jednotka' => 'ws\Ciselnik\JednotkaController',
			'controllers.kalendar' => 'ws\Ciselnik\KalendarController',
			'controllers.odmena' => 'ws\Person\OdmenaController',
			'controllers.osoba' => 'ws\Ciselnik\OsobaController',
			'controllers.plan' => 'ws\Vyroba\PlanController',
			'controllers.pracoviste' => 'ws\Ciselnik\PracovisteController',
			'controllers.setting' => 'ws\Pomocne\CommonController',
			'controllers.sklad' => 'ws\Ciselnik\SkladController',
			'controllers.tavirna' => 'ws\Tavirna\TavirnaController',
			'controllers.user' => 'ws\Security\UserController',
			'controllers.user.isLoggedIn' => 'ws\Bootstrap\ProxyController',
			'controllers.user.login' => 'ws\Bootstrap\ProxyController',
			'controllers.user.logout' => 'ws\Bootstrap\ProxyController',
			'controllers.userrole' => 'ws\Security\UserRoleController',
			'controllers.zdroj' => 'ws\Ciselnik\ZdrojController',
			'http.context' => 'Nette\Http\Context',
			'http.request' => 'Nette\Http\Request',
			'http.requestFactory' => 'Nette\Http\RequestFactory',
			'http.response' => 'ws\Bootstrap\Response',
			'responses' => 'ws\Responses\Responses',
			'security.passwords' => 'Nette\Security\Passwords',
			'security.user' => 'Nette\Security\User',
			'security.userStorage' => 'Nette\Security\IUserStorage',
			'session.session' => 'Nette\Http\Session',
			'tracy.bar' => 'Tracy\Bar',
			'tracy.blueScreen' => 'Tracy\BlueScreen',
			'tracy.logger' => 'Tracy\ILogger',
		],
		'tags' => [
			'inject' => [
				'commands.0' => TRUE,
				'controllers' => TRUE,
				'controllers.auta' => TRUE,
				'controllers.auta.autoAdd' => TRUE,
				'controllers.auta.autoDrop' => TRUE,
				'controllers.auta.autoList' => TRUE,
				'controllers.auta.autoUser' => TRUE,
				'controllers.cestak' => TRUE,
				'controllers.cestak.saveList' => TRUE,
				'controllers.cestak.showList' => TRUE,
				'controllers.jednotka' => TRUE,
				'controllers.kalendar' => TRUE,
				'controllers.odmena' => TRUE,
				'controllers.osoba' => TRUE,
				'controllers.plan' => TRUE,
				'controllers.pracoviste' => TRUE,
				'controllers.setting' => TRUE,
				'controllers.sklad' => TRUE,
				'controllers.tavirna' => TRUE,
				'controllers.user' => TRUE,
				'controllers.user.isLoggedIn' => TRUE,
				'controllers.user.login' => TRUE,
				'controllers.user.logout' => TRUE,
				'controllers.userrole' => TRUE,
				'controllers.zdroj' => TRUE,
				'responses' => TRUE,
			],
			'command' => ['commands.0' => TRUE],
		],
		'aliases' => [
			'httpRequest' => 'http.request',
			'httpResponse' => 'http.response',
			'nette.httpContext' => 'http.context',
			'nette.httpRequestFactory' => 'http.requestFactory',
			'nette.userStorage' => 'security.userStorage',
			'session' => 'session.session',
			'user' => 'security.user',
		],
	];


	public function __construct()
	{
		parent::__construct([
			'appDir' => '/var/www/html/gis/ws/Bootstrap',
			'wwwDir' => '/var/www/html/gis/generator',
			'debugMode' => FALSE,
			'productionMode' => TRUE,
			'consoleMode' => TRUE,
			'tempDir' => '/var/www/html/gis/generator/temp',
			'dibi' => [
				'host' => 'localhost',
				'username' => 'postgres',
				'password' => 'pratele',
				'database' => 'gvyroba',
				'driver' => 'postgre',
			],
		]);
	}


	/**
	 * @return ws\Security\Authenticator
	 */
	public function createServiceAuthenticator()
	{
		$service = new ws\Security\Authenticator;
		return $service;
	}


	/**
	 * @return ws\Security\Authorizator
	 */
	public function createServiceAuthorizator()
	{
		$service = new ws\Security\Authorizator;
		return $service;
	}


	/**
	 * @return ws\Security\CreateAdminCommand
	 */
	public function createServiceCommands__0()
	{
		$service = new ws\Security\CreateAdminCommand;
		return $service;
	}


	/**
	 * @return Nette\DI\Container
	 */
	public function createServiceContainer()
	{
		return $this;
	}


	/**
	 * @return ws\Bootstrap\Controllers
	 */
	public function createServiceControllers()
	{
		$service = new ws\Bootstrap\Controllers([
			'controllers.user.login',
			'controllers.user.logout',
			'controllers.user.isLoggedIn',
			'controllers.cestak.showList',
			'controllers.cestak.saveList',
			'controllers.auta.autoList',
			'controllers.auta.autoUser',
			'controllers.auta.autoAdd',
			'controllers.auta.autoDrop',
		]);
		$service->response = $this->getService('http.response');
		$service->request = $this->getService('http.request');
		$service->container = $this;
		return $service;
	}


	/**
	 * @return ws\Cestak\AutaController
	 */
	public function createServiceControllers__auta()
	{
		$service = new ws\Cestak\AutaController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__auta__autoAdd()
	{
		$service = new ws\Bootstrap\ProxyController('auta.autoAdd', $this->getService('controllers.auta'),
			'autoAdd');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__auta__autoDrop()
	{
		$service = new ws\Bootstrap\ProxyController('auta.autoDrop', $this->getService('controllers.auta'),
			'autoDrop');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__auta__autoList()
	{
		$service = new ws\Bootstrap\ProxyController('auta.autoList', $this->getService('controllers.auta'),
			'autoList');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__auta__autoUser()
	{
		$service = new ws\Bootstrap\ProxyController('auta.autoUser', $this->getService('controllers.auta'),
			'autoUser');
		return $service;
	}


	/**
	 * @return ws\Cestak\CestakController
	 */
	public function createServiceControllers__cestak()
	{
		$service = new ws\Cestak\CestakController;
		$service->usrCtrl = $this->getService('controllers.user');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__cestak__saveList()
	{
		$service = new ws\Bootstrap\ProxyController('cestak.saveList', $this->getService('controllers.cestak'),
			'saveList');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__cestak__showList()
	{
		$service = new ws\Bootstrap\ProxyController('cestak.showList', $this->getService('controllers.cestak'),
			'showList');
		return $service;
	}


	/**
	 * @return ws\Ciselnik\JednotkaController
	 */
	public function createServiceControllers__jednotka()
	{
		$service = new ws\Ciselnik\JednotkaController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Ciselnik\KalendarController
	 */
	public function createServiceControllers__kalendar()
	{
		$service = new ws\Ciselnik\KalendarController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Person\OdmenaController
	 */
	public function createServiceControllers__odmena()
	{
		$service = new ws\Person\OdmenaController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Ciselnik\OsobaController
	 */
	public function createServiceControllers__osoba()
	{
		$service = new ws\Ciselnik\OsobaController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Vyroba\PlanController
	 */
	public function createServiceControllers__plan()
	{
		$service = new ws\Vyroba\PlanController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Ciselnik\PracovisteController
	 */
	public function createServiceControllers__pracoviste()
	{
		$service = new ws\Ciselnik\PracovisteController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Pomocne\CommonController
	 */
	public function createServiceControllers__setting()
	{
		$service = new ws\Pomocne\CommonController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Ciselnik\SkladController
	 */
	public function createServiceControllers__sklad()
	{
		$service = new ws\Ciselnik\SkladController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Tavirna\TavirnaController
	 */
	public function createServiceControllers__tavirna()
	{
		$service = new ws\Tavirna\TavirnaController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Security\UserController
	 */
	public function createServiceControllers__user()
	{
		$service = new ws\Security\UserController;
		$service->user = $this->getService('security.user');
		$service->responses = $this->getService('responses');
		$service->authorizator = $this->getService('authorizator');
		$service->authenticator = $this->getService('authenticator');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__user__isLoggedIn()
	{
		$service = new ws\Bootstrap\ProxyController('user.isLoggedIn', $this->getService('controllers.user'),
			'isLoggedIn');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__user__login()
	{
		$service = new ws\Bootstrap\ProxyController('user.login', $this->getService('controllers.user'),
			'login');
		return $service;
	}


	/**
	 * @return ws\Bootstrap\ProxyController
	 */
	public function createServiceControllers__user__logout()
	{
		$service = new ws\Bootstrap\ProxyController('user.logout', $this->getService('controllers.user'),
			'logout');
		return $service;
	}


	/**
	 * @return ws\Security\UserRoleController
	 */
	public function createServiceControllers__userrole()
	{
		$service = new ws\Security\UserRoleController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return ws\Ciselnik\ZdrojController
	 */
	public function createServiceControllers__zdroj()
	{
		$service = new ws\Ciselnik\ZdrojController;
		$service->user = $this->getService('security.user');
		return $service;
	}


	/**
	 * @return Nette\Http\Context
	 */
	public function createServiceHttp__context()
	{
		$service = new Nette\Http\Context($this->getService('http.request'), $this->getService('http.response'));
		trigger_error('Service http.context is deprecated.', 16384);
		return $service;
	}


	/**
	 * @return Nette\Http\Request
	 */
	public function createServiceHttp__request()
	{
		$service = $this->getService('http.requestFactory')->createHttpRequest();
		if (!$service instanceof Nette\Http\Request) {
			throw new Nette\UnexpectedValueException('Unable to create service \'http.request\', value returned by factory is not Nette\Http\Request type.');
		}
		return $service;
	}


	/**
	 * @return Nette\Http\RequestFactory
	 */
	public function createServiceHttp__requestFactory()
	{
		$service = new Nette\Http\RequestFactory;
		$service->setProxy([]);
		return $service;
	}


	/**
	 * @return ws\Bootstrap\Response
	 */
	public function createServiceHttp__response()
	{
		$service = new ws\Bootstrap\Response;
		return $service;
	}


	/**
	 * @return ws\Responses\Responses
	 */
	public function createServiceResponses()
	{
		$service = new ws\Responses\Responses([
			'json' => 'ws\Responses\JsonResponse',
			'text' => 'ws\Responses\TextResponse',
		]);
		$service->injectContainer($this);
		return $service;
	}


	/**
	 * @return Nette\Security\Passwords
	 */
	public function createServiceSecurity__passwords()
	{
		$service = new Nette\Security\Passwords;
		return $service;
	}


	/**
	 * @return Nette\Security\User
	 */
	public function createServiceSecurity__user()
	{
		$service = new Nette\Security\User($this->getService('security.userStorage'), $this->getService('authenticator'),
			$this->getService('authorizator'));
		return $service;
	}


	/**
	 * @return Nette\Security\IUserStorage
	 */
	public function createServiceSecurity__userStorage()
	{
		$service = new Nette\Http\UserStorage($this->getService('session.session'));
		return $service;
	}


	/**
	 * @return Nette\Http\Session
	 */
	public function createServiceSession__session()
	{
		$service = new Nette\Http\Session($this->getService('http.request'), $this->getService('http.response'));
		$service->setExpiration('3900 days');
		return $service;
	}


	/**
	 * @return Tracy\Bar
	 */
	public function createServiceTracy__bar()
	{
		$service = Tracy\Debugger::getBar();
		if (!$service instanceof Tracy\Bar) {
			throw new Nette\UnexpectedValueException('Unable to create service \'tracy.bar\', value returned by factory is not Tracy\Bar type.');
		}
		return $service;
	}


	/**
	 * @return Tracy\BlueScreen
	 */
	public function createServiceTracy__blueScreen()
	{
		$service = Tracy\Debugger::getBlueScreen();
		if (!$service instanceof Tracy\BlueScreen) {
			throw new Nette\UnexpectedValueException('Unable to create service \'tracy.blueScreen\', value returned by factory is not Tracy\BlueScreen type.');
		}
		return $service;
	}


	/**
	 * @return Tracy\ILogger
	 */
	public function createServiceTracy__logger()
	{
		$service = Tracy\Debugger::getLogger();
		if (!$service instanceof Tracy\ILogger) {
			throw new Nette\UnexpectedValueException('Unable to create service \'tracy.logger\', value returned by factory is not Tracy\ILogger type.');
		}
		return $service;
	}


	public function initialize()
	{
		Tracy\Debugger::$editorMapping = [];
	}

}
