# EnCAB

Python program to update HTML website with algorithms calculation (with indexes) imported from XML data.


## How It Works

Upon launch, EnCAB.py does the following things:
1. Makes a list of all file names in the website directory
2. Parses XML data contained in the algoritms directory and checks for errors
3. Reads HTML files and extract `<section>` attributes
4. Generates HTML from templates with the data and attributes
5. Updates the content of `<section>` with the new generated HTML


## Getting started

Required at least Python 3.6
To install the program in the EnCAB directory:
```shell
git clone https://github.com/fabfab1/EnCAB.git
cd EnCAB/EnCAB
pythom -m pip -r requirements.txt

```

To run the program:
```shell
./EnCAB.py
```

Press ENTER to confirm configuration and update HTML files.


### Built With

* [Python 3](https://www.python.org/download/releases/3.0/) - The web framework used
* [Jinja2](http://jinja.pocoo.org/) - Templating engine
* [ElementTree](https://docs.python.org/3/library/xml.etree.elementtree.html) - Used to parse XML
* [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) - Used to parse HTML


## Configuration

Edit config file "config.py" to change directories and other preferences.

The program will access in read mode the HTML files and the algorithms data.
It will access in read-write mode the HTML files containing ```<section block="algorithm/index" sort="(name)"></section>``` and write the data inside it, keeping the formatting of the file.

```block="algorithm" sort="(name)"```  
write algorithms data, insert in `(name)` a SORT_STRINGS (from `config.py`) or XML XPath of desired item to sort.

```block="index" sort="(name)"```  
write files index, insert in `(name)` the folder name of desired files to use for the sorted index.

### Data

Each algorithms must have its own XML file stored in ALGORITHMS_DIR with `.xml` or `.txt` extensions.  
See file `- algorithms codes format` for mandatory format of the codes.

### HTML Templates

Templates are written in Jinja2 templating language.  
The XML ElementTree is passed as argument for the algorithms.  
The index of files is passed as argument fot the indexes.


### Dinamic calculations

Dinamic algorithms calculation on the HTML page can be made with javascript, as in `script.js`.


### Errors

The log with the errors found are stored in the file `log.txt`.


## Authors

* **Bernardo Forni** - [fornib](https://github.com/fornib)


## Licensing

LGPL-3.0
