# EnCAB

Python program to update HTML website with algorithms calculation (with indexes) imported from XML data.


## How It Works

Upon launch, `EnCAB.py` does the following things:
1. Make a list of all file names in the website directory
2. Parse XML data contained in the algoritms' directory and check for errors
3. Generate HTML code from templates with the data
4. Update website HTML files with `<section>` tags, writing inside the tags the generated HTML code

## Getting started

Required at least Python 3.6.

To install the program in the EnCAB directory:
```shell
git clone https://github.com/fabfab1/EnCAB.git
cd EnCAB/EnCAB
python -m pip -r requirements.txt
```

To run the program:
```shell
./EnCAB.py
```


### Built With

* [Python 3](https://www.python.org/download/releases/3.0/) - The web framework used
* [Jinja2](http://jinja.pocoo.org/) - Templating engine
* [ElementTree](https://docs.python.org/3/library/xml.etree.elementtree.html) - Used to parse XML
* [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) - Used to parse HTML


## Configuration

Edit config file `config.py` to change file and directory names and other preferences.

The program will access in read mode the HTML files and the algorithms data.
It will access in read-write mode the HTML files containing ```<section block="[algorithm/index]" sort="[name]">...</section>``` and substitute all the data inside it.

Possible attributes:
- `block="algorithm" sort="[name]"` for algorithms data, insert in `[name]` a *SORT_STRINGS* (from `config.py`) or XML path of desired item to sort.
- `block="index" sort="[name]"` for files index, insert in `[name]` the directory name for the files to list.


### Data

Each algorithms must have its own XML file stored in *ALGORITHMS_DIR* (from `config.py`) with `.xml` extension.  
See in `templates/` for algorithms format codes.


### HTML Templates

Templates are written in Jinja2 templating language.
  
The XML ElementTree is passed as argument for the algorithms.  
The index of files is passed as argument fot the indexes.


### Dynamic calculations

Dynamic algorithms calculation on the HTML page are made with javascript, as in `script.js`.


### Errors

The log with the errors found is stored in the `log.txt`.


## Authors

* **Bernardo Forni** - [fornib](https://github.com/fornib)


## Licensing

LGPL-3.0
