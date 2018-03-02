""" Configuration file for EnCAB.py """


# All paths can be absolute or relative to the program file
# Use ONLY the slash " / " as directory separator


# Path to root directory where the website is located
# the program  will scan all .html or .htm files in directory and subdirectories
WEBSITE_DIR = "../docs"  # default: "../docs"

# Path to directory where algorithm data are located (.xml or .txt files)
ALGORITHMS_DIR = "../docs/algorithms_data"  # default: "algorithms_data"

# Path to template files, used to generate the HTML <section>
TEMPLATE_ALGORITHM = "templates/algorithm.html"  # default: "templates/algorithm.html"
TEMPLATE_INDEX = "templates/index.html"  # default: "templates/index.html"


# Extra options

# List of used tags to check for unknown tags in XML input
KNOWN_TAGS = ["reference", "biblioref", "authorgroup"]

# List of possible sort attributes for <section> with relative XML tag
SORT_STRINGS = {'algorithm_types': 'algorithm_description/algorithm_types',
                'position_in_process': 'algorithm_description/position_in_process',
                'material': 'algorithm_description/material',
                'abbrev': 'biblioref/abbrev'}

# INDEXES = [..,..] folders
# IGNORE_IF_CONTAIN = "_index"  #_files to ignore in index