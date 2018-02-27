# EnCAB
> Work in progress

Python program to update static website with indexes and algorithms.



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

Python 3, with Jinja2 (for templating) and BeautifulSoup (for editing HTML).


## Configuration

Edit config file ("config.py") to change directories and preference.
The program will access the HTML files and the algorithms data.
The algorithms data are XML files for each algorithm.

The website MUST contain the directories named as the different <algorithm_description>,
each containing the different HTML files to be indexed.


## Tests

[coming soon]

```shell
test/test.py
```


## Licensing

LGPL-3.0
