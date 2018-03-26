# EnCAB

Python program to update static HTML website with algorithms and index imported from XML data.


## Getting started

Required Python 3.
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

Python 3, with Jinja2 (for templating), ElementTree (for parsing XML) and BeautifulSoup (for parsing HTML).


## Configuration

Edit config file "config.py" to change directories and other preferences.

The program will read the HTML files and the algorithms data.
It will write the HTML data in *.html files inside <section block="algorithm/index" sort="(name)"></section>.
block="algorithm" sort="(name)" --> write algorithms data, insert in (name) a SORT_STRINGS (from "config.py") or XML XPath of desired item to sort
block="index" sort="(name)"     --> write files index, insert in (name) the folder name of desired files to use for the sorted index

Templates are written in Jinja2 templating language. The XML ElementTree is passed as argument.

### Data

Each algorithms must have its own XML file stored in ALGORITHMS_DIR with .xml or .txt extension.
See "- algorithms codes format" for mandatory format of the codes.

### Errors

The log containing the errors found by the program are stored in the file "log.txt".


## Licensing

LGPL-3.0
