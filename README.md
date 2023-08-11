# Gis

Struktura programu

app - angular klient strana
vendor - knihovny tretich stran pouzity v app
ws - php skripty server strana
storage - zde se uchovavaji prilohy
storage_report - zde jsou uchovavany tiskove setavy, ktere byly nahrany do systemu pres webove rozhrani




*** pro vytvareni PDF dokumentu ****
reporter pouziva pro vytvarni pdf libreoffice

** pdfunite - pro spojovani pdf souboru 
sudo apt-get install poppler-utils
** libreoffice 
sudo apt-get install libreoffice


/**** vzdalene pripojeni na POSTU ***/
/etc/mysql/mysql.conf.d/mysqld.cnf

# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
bind-address            = 0.0.0.0

GRANT ALL PRIVILEGES ON *.* TO 'uzivatel'@'%' IDENTIFIED BY 'heslo uzivatele' with grant option;



/***** TISKOVE SESTAVY ***/

** pdfunite - pro spojovani pdf souboru 
sudo apt-get install poppler-utils
** libreoffice 
sudo apt-get install libreoffice


potreba vytvorit adresare  /var/www/.cache /var/www/.config

dev@webmail:/var/www$
drwx------  3 www-data www-data 4096 bře 22  2022 .cache
drwx------  3 www-data www-data 4096 říj  7 13:12 .config

