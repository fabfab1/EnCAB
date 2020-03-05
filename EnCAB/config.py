""" Configuration file for EnCAB.py """


# All paths can be absolute or relative to the program file EnCAB.py
# Use the slash "/" as directory separator (NO backslash "\")


# Path to root directory where the website is located
# the program  will scan all *.html files in directory and subdirectories
WEBSITE_DIR = "../docs/"  # default: "../docs/"

# Path to directory where algorithms data are located (*.xml files)
ALGORITHMS_DIR = WEBSITE_DIR + "algorithms_xml/"  # default:  WEBSITE_DIR + "algorithms_data/"

# Path to file where HTML author bibliography is located
BIBLIOGRAPHY_FILE = WEBSITE_DIR + "bibliography/bibliography.html"  # default: WEBSITE_DIR + "bibliography/bibliography.html"

# Path to template files, used to generate the HTML <section>
TEMPLATE_ALGORITHM = "templates/algorithm.html"  # default: "templates/algorithm.html"
TEMPLATE_INDEX = "templates/index.html"  # default: "templates/index.html"


# Possible sort attributes of <section>, assign XML path to sort
SORT_STRINGS = {'algorithm_type': 'algorithm_description/algorithm_type',
                'position_in_process': 'algorithm_description/position_in_process',
                'material': 'algorithm_description/material',
                'abbrev': 'biblioref/source/abbrev'}

# Files to ignore for the index if they contain the string in the filename
IGNORE_IF_IN_FILENAME = ("_index", "_data")  # default: ("_index", "_data")
