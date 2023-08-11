<?php
// source: /var/www/html/gis/generator/../ws/config.neon
// source: array

/** @noinspection PhpParamsInspection,PhpMethodMayBeStaticInspection */

declare(strict_types=1);

class Container_8ca5273c62 extends Nette\DI\Container
{
	protected $tags = [
		'inject' => [
			'commands.0' => true,
			'controllers' => true,
			'controllers.setting' => true,
			'controllers.user' => true,
			'controllers.user.isLoggedIn' => true,
			'controllers.user.login' => true,
			'controllers.user.logout' => true,
			'controllers.userrole' => true,
			'responses' => true,
		],
		'command' => ['commands.0' => true],
	];

	protected $types = ['container' => 'Nette\DI\Container'];

	protected $aliases = [
		'httpRequest' => 'http.request',
		'httpResponse' => 'http.response',
		'nette.httpRequestFactory' => 'http.requestFactory',
		'nette.userStorage' => 'security.userStorage',
		'session' => 'session.session',
		'user' => 'security.user',
	];

	protected $wiring = [
		'Nette\DI\Container' => [['container']],
		'Nette\Http\RequestFactory' => [['http.requestFactory']],
		'Nette\Http\IRequest' => [['http.request']],
		'Nette\Http\Request' => [['http.request']],
		'Nette\Http\IResponse' => [['http.response']],
		'Nette\Http\Response' => [['http.response']],
		'Tracy\ILogger' => [['tracy.logger']],
		'Tracy\BlueScreen' => [['tracy.blueScreen']],
		'Tracy\Bar' => [['tracy.bar']],
		'Nette\Security\Passwords' => [['security.passwords']],
		'Nette\Security\UserStorage' => [['security.userStorage']],
		'Nette\Security\IUserStorage' => [['security.legacyUserStorage']],
		'Nette\Security\User' => [['security.user']],
		'Nette\Http\Session' => [['session.session']],
		'ws\BaseController' => [['controllers.user']],
		'ws\Security\UserController' => [['controllers.user']],
		'ws\Bootstrap\ProxyController' => [
			['controllers.user.login', 'controllers.user.logout', 'controllers.user.isLoggedIn'],
		],
		'ws\Security\UserRoleController' => [['controllers.userrole']],
		'ws\Pomocne\CommonController' => [['controllers.setting']],
		'ws\Bootstrap\Controllers' => [['controllers']],
		'ws\Responses\Responses' => [['responses']],
		'Symfony\Component\Console\Command\Command' => [['commands.0']],
		'ws\Security\CreateAdminCommand' => [['commands.0']],
		'Nette\Security\IAuthenticator' => [['authenticator']],
		'ws\Security\Authenticator' => [['authenticator']],
		'Nette\Security\Permission' => [['authorizator']],
		'Nette\Security\Authorizator' => [['authorizator']],
		'ws\Security\Authorizator' => [['authorizator']],
	];


	public function __construct(array $params = [])
	{
		parent::__construct($params);
		$this->parameters += [
			'dibi' => [
				'host' => 'localhost',
				'username' => 'postgres',
				'password' => 'pratele',
				'database' => 'gvyroba',
				'driver' => 'postgre',
			],
			'karat' => [
				'host' => '192.168.1.8',
				'username' => 'GIFF_GIIS',
				'password' => 'OIz24QS3soD4Bg*',
				'database' => 'KARAT_GIFF',
				'options' => ['CharacterSet' => 'UTF-8', 'Encrypt' => false, 'TrustServerCertificate' => true],
				'driver' => 'sqlsrv',
			],
			'posta' => [
				'host' => '192.168.1.121',
				'username' => 'gisiis',
				'password' => 'G1s44s123*272',
				'database' => 'posta',
				'driver' => 'mysqli',
			],
			'appDir' => '/var/www/html/gis/ws/Bootstrap',
			'wwwDir' => '/var/www/html/gis/generator',
			'vendorDir' => '/var/www/html/gis/vendor',
			'debugMode' => false,
			'productionMode' => true,
			'consoleMode' => true,
			'tempDir' => '/var/www/html/gis/generator/temp',
		];
	}


	public function createServiceAuthenticator(): ws\Security\Authenticator
	{
		return new ws\Security\Authenticator;
	}


	public function createServiceAuthorizator(): ws\Security\Authorizator
	{
		return new ws\Security\Authorizator;
	}


	public function createServiceCommands__0(): ws\Security\CreateAdminCommand
	{
		return new ws\Security\CreateAdminCommand;
	}


	public function createServiceContainer(): Container_8ca5273c62
	{
		return $this;
	}


	public function createServiceControllers(): ws\Bootstrap\Controllers
	{
		return new ws\Bootstrap\Controllers(['controllers.user.login', 'controllers.user.logout', 'controllers.user.isLoggedIn']);
	}


	public function createServiceControllers__setting(): ws\Pomocne\CommonController
	{
		return new ws\Pomocne\CommonController;
	}


	public function createServiceControllers__user(): ws\Security\UserController
	{
		return new ws\Security\UserController;
	}


	public function createServiceControllers__user__isLoggedIn(): ws\Bootstrap\ProxyController
	{
		return new ws\Bootstrap\ProxyController('user.isLoggedIn', $this->getService('controllers.user'), 'isLoggedIn');
	}


	public function createServiceControllers__user__login(): ws\Bootstrap\ProxyController
	{
		return new ws\Bootstrap\ProxyController('user.login', $this->getService('controllers.user'), 'login');
	}


	public function createServiceControllers__user__logout(): ws\Bootstrap\ProxyController
	{
		return new ws\Bootstrap\ProxyController('user.logout', $this->getService('controllers.user'), 'logout');
	}


	public function createServiceControllers__userrole(): ws\Security\UserRoleController
	{
		return new ws\Security\UserRoleController;
	}


	public function createServiceHttp__request(): Nette\Http\Request
	{
		return $this->getService('http.requestFactory')->fromGlobals();
	}


	public function createServiceHttp__requestFactory(): Nette\Http\RequestFactory
	{
		$service = new Nette\Http\RequestFactory;
		$service->setProxy([]);
		return $service;
	}


	public function createServiceHttp__response(): Nette\Http\Response
	{
		$service = new Nette\Http\Response;
		$service->cookieSecure = $this->getService('http.request')->isSecured();
		return $service;
	}


	public function createServiceResponses(): ws\Responses\Responses
	{
		return new ws\Responses\Responses(['json' => 'ws\Responses\JsonResponse', 'text' => 'ws\Responses\TextResponse']);
	}


	public function createServiceSecurity__legacyUserStorage(): Nette\Security\IUserStorage
	{
		return new Nette\Http\UserStorage($this->getService('session.session'));
	}


	public function createServiceSecurity__passwords(): Nette\Security\Passwords
	{
		return new Nette\Security\Passwords;
	}


	public function createServiceSecurity__user(): Nette\Security\User
	{
		return new Nette\Security\User(
			$this->getService('security.legacyUserStorage'),
			$this->getService('authenticator'),
			$this->getService('authorizator'),
			$this->getService('security.userStorage')
		);
	}


	public function createServiceSecurity__userStorage(): Nette\Security\UserStorage
	{
		return new Nette\Bridges\SecurityHttp\SessionStorage($this->getService('session.session'));
	}


	public function createServiceSession__session(): Nette\Http\Session
	{
		$service = new Nette\Http\Session($this->getService('http.request'), $this->getService('http.response'));
		$service->setExpiration('3900 days');
		$service->setOptions([
			'savePath' => '/var/www/html/gis/generator/temp/session',
			'readAndClose' => null,
			'cookieSamesite' => 'Lax',
		]);
		return $service;
	}


	public function createServiceTracy__bar(): Tracy\Bar
	{
		return Tracy\Debugger::getBar();
	}


	public function createServiceTracy__blueScreen(): Tracy\BlueScreen
	{
		return Tracy\Debugger::getBlueScreen();
	}


	public function createServiceTracy__logger(): Tracy\ILogger
	{
		return Tracy\Debugger::getLogger();
	}


	public function initialize()
	{
		// tracy.
		(function () {
			if (!Tracy\Debugger::isEnabled()) { return; }
		})();
	}
}
