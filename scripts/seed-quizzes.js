'use strict';

/**
 * Quiz Game Seed Script
 * Creates 4 quizzes per category (8 categories = 32 quizzes total)
 * Each quiz has 10 questions (single_choice + multiple_choice)
 * Downloads unique images for each quiz to public/images
 *
 * Usage:
 *   node scripts/seed-quizzes.js
 *
 * Requirements:
 *   - Add SUPABASE_SERVICE_ROLE_KEY to .env.local for direct DB insertion
 *   - OR run the generated SQL file in Supabase SQL Editor
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Load .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const eqIdx = line.indexOf('=');
    if (eqIdx > 0) {
      const key = line.slice(0, eqIdx).trim();
      const val = line.slice(eqIdx + 1).trim();
      if (key && val && !process.env[key]) process.env[key] = val;
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const IMAGES_DIR = path.join(__dirname, '../public/images');
const SQL_OUTPUT = path.join(__dirname, 'seed-quizzes-generated.sql');

const CATEGORY_IDS = {
  programming: 'bf1993e6-69a8-41d2-9c59-d19678185698',
  science:     'e3cafcf2-de3a-41a9-83e9-5c4a80a69026',
  geography:   '93dd2211-759e-4b68-81c4-f0b6c64d4273',
  history:     '6a9993de-8113-41e9-9a25-3bdcf48d0674',
  animals:     'ae5d0b51-579f-4cce-bc50-13b29ab585ab',
  music:       '82157280-144a-411c-832c-4439a9b0e141',
  health:      '6915253a-5956-4fd6-9d5b-978f8bc6815d',
  sports:      '7b5c870e-f2a2-44d3-8e68-06f11a525ac8',
};

// ==========================================================================
// QUIZ DATA
// Question format: [type, text, [options...], correctIndex_or_Array, explanation]
// type: 's' = single_choice, 'm' = multiple_choice
// ==========================================================================
const QUIZZES = [
  // ========== PROGRAMMING ==========
  {
    title: 'Python Programming Basics',
    slug: 'python-programming-basics',
    description: 'Master Python fundamentals including syntax, data types, and core programming concepts',
    category: 'programming', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-python-basics.jpg',
    imageKeyword: 'python,programming,code,developer',
    questions: [
      ['s', 'What keyword is used to define a function in Python?',
        ['def', 'function', 'func', 'define'], 0,
        'The "def" keyword is used to define functions in Python.'],
      ['s', 'What is the output of print(2 ** 3) in Python?',
        ['6', '8', '9', '5'], 1,
        'The ** operator is the exponentiation operator. 2 ** 3 = 2³ = 8.'],
      ['s', 'Which symbol is used for single-line comments in Python?',
        ['#', '//', '/*', '--'], 0,
        'In Python, the # symbol is used for single-line comments.'],
      ['s', 'What does the len() function return?',
        ['The last element', 'The number of items in an object', 'The data type of an object', 'The first element'], 1,
        'len() returns the number of items in a sequence or collection.'],
      ['s', 'What is the result of 10 // 3 in Python?',
        ['3', '3.33', '1', '30'], 0,
        'The // operator performs integer (floor) division, so 10 // 3 = 3.'],
      ['s', 'What does the type() function return in Python?',
        ['The value of the variable', 'The data type of the object', 'The memory address of the object', 'The length of the object'], 1,
        'type() returns the data type (class) of the given object.'],
      ['m', 'Which of the following are Python built-in data types? (Select all that apply)',
        ['int', 'str', 'bool', 'char', 'decimal'], [0, 1, 2],
        'Python built-in types include int, str, bool, float, list, dict, tuple, etc. "char" and "decimal" are not built-in types.'],
      ['m', 'Which are valid Python list methods? (Select all that apply)',
        ['append()', 'remove()', 'sort()', 'push()', 'shift()'], [0, 1, 2],
        'Python lists have append(), remove(), and sort() methods. "push()" and "shift()" are JavaScript array methods.'],
      ['m', 'Which keywords are used for loops in Python? (Select all that apply)',
        ['for', 'while', 'loop', 'iterate', 'each'], [0, 1],
        'Python uses "for" and "while" as loop keywords. "loop", "iterate", and "each" are not Python keywords.'],
      ['m', 'Which of the following are valid ways to create a string in Python? (Select all that apply)',
        ['name = "Alice"', "name = 'Alice'", 'name = """Alice"""', 'string name = "Alice"'], [0, 1, 2],
        'Python strings can use single, double, or triple quotes. Type declarations like "string" are not valid Python.'],
    ],
  },
  {
    title: 'Web Development Essentials',
    slug: 'web-development-essentials',
    description: 'Explore core concepts of HTML, CSS, and JavaScript for building modern websites',
    category: 'programming', timeLimit: 15, difficulty: 2,
    imageFile: 'quiz-web-development.jpg',
    imageKeyword: 'web,development,html,css,coding',
    questions: [
      ['s', 'What does HTML stand for?',
        ['HyperText Markup Language', 'High-Level Text Markup Language', 'HyperTransfer Markup Language', 'Hyperlink and Text Markup Language'], 0,
        'HTML stands for HyperText Markup Language, the standard markup language for web pages.'],
      ['s', 'Which HTML tag is used to create a hyperlink?',
        ['<link>', '<a>', '<href>', '<url>'], 1,
        'The <a> (anchor) tag is used to create hyperlinks in HTML.'],
      ['s', 'What does CSS stand for?',
        ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], 1,
        'CSS stands for Cascading Style Sheets, used for styling HTML elements.'],
      ['s', 'Which HTTP method is typically used to submit form data to a server?',
        ['GET', 'POST', 'PUT', 'DELETE'], 1,
        'POST sends form data in the request body and is the standard method for form submissions.'],
      ['s', 'What is the correct CSS selector for an element with id="header"?',
        ['.header', '#header', '*header', '@header'], 1,
        'The # symbol selects elements by their ID in CSS.'],
      ['s', 'What does the CSS property display: flex do?',
        ['Makes element invisible', 'Enables flexbox layout', 'Adds a border', 'Centers the element vertically'], 1,
        'display: flex enables CSS Flexbox, allowing flexible arrangement of child elements.'],
      ['m', 'Which of the following are valid HTML5 semantic elements? (Select all that apply)',
        ['<header>', '<footer>', '<nav>', '<article>', '<content>'], [0, 1, 2, 3],
        'HTML5 semantic elements include <header>, <footer>, <nav>, <article>, <section>, <main>, etc. <content> is not valid HTML5.'],
      ['m', 'Which are components of the CSS box model? (Select all that apply)',
        ['margin', 'padding', 'border', 'content', 'background'], [0, 1, 2, 3],
        'The CSS box model consists of margin, border, padding, and content. Background is a property, not a box model component.'],
      ['m', 'Which of these are JavaScript front-end frameworks or libraries? (Select all that apply)',
        ['React', 'Vue', 'Angular', 'Django', 'Flask'], [0, 1, 2],
        'React, Vue, and Angular are JavaScript front-end frameworks. Django and Flask are Python back-end frameworks.'],
      ['m', 'Which of the following are valid CSS position values? (Select all that apply)',
        ['static', 'relative', 'absolute', 'fixed', 'floating'], [0, 1, 2, 3],
        'CSS position values include static, relative, absolute, fixed, and sticky. "floating" is not a position value.'],
    ],
  },
  {
    title: 'Database & SQL Fundamentals',
    slug: 'database-sql-fundamentals',
    description: 'Learn the fundamentals of databases and SQL for querying and managing data',
    category: 'programming', timeLimit: 15, difficulty: 2,
    imageFile: 'quiz-database-sql.jpg',
    imageKeyword: 'database,sql,server,data,storage',
    questions: [
      ['s', 'What does SQL stand for?',
        ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Language'], 0,
        'SQL stands for Structured Query Language, used for managing relational databases.'],
      ['s', 'Which SQL command is used to retrieve data from a database?',
        ['GET', 'FETCH', 'SELECT', 'RETRIEVE'], 2,
        'The SELECT statement retrieves data from one or more database tables.'],
      ['s', 'Which clause is used to filter rows in a SQL query?',
        ['FILTER', 'WHERE', 'HAVING', 'LIMIT'], 1,
        'The WHERE clause filters rows based on specified conditions.'],
      ['s', 'What does INNER JOIN do in SQL?',
        ['Returns all rows from the left table', 'Returns only matching rows from both tables', 'Returns all rows from both tables', 'Returns only non-matching rows'], 1,
        'INNER JOIN returns only rows where there is a match in both tables.'],
      ['s', 'What does a PRIMARY KEY ensure in a database table?',
        ['Data is stored alphabetically', 'Each row has a unique identifier', 'Data is encrypted', 'Rows are sorted by insertion order'], 1,
        'A PRIMARY KEY uniquely identifies each row and cannot contain NULL values.'],
      ['s', 'What does NULL represent in SQL?',
        ['Zero (0)', 'An empty string', 'Missing or unknown data', 'False'], 2,
        'NULL represents missing or unknown data — it is not the same as zero or empty string.'],
      ['m', 'Which of the following are SQL aggregate functions? (Select all that apply)',
        ['COUNT()', 'SUM()', 'AVG()', 'GROUP()', 'FILTER()'], [0, 1, 2],
        'SQL aggregate functions include COUNT(), SUM(), AVG(), MIN(), and MAX(). GROUP() and FILTER() are not SQL aggregate functions.'],
      ['m', 'Which SQL commands are DML (Data Manipulation Language)? (Select all that apply)',
        ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE'], [0, 1, 2, 3],
        'DML commands are SELECT, INSERT, UPDATE, and DELETE. CREATE TABLE is DDL (Data Definition Language).'],
      ['m', 'Which of the following are types of SQL JOINs? (Select all that apply)',
        ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'TOP JOIN'], [0, 1, 2, 3],
        'Standard SQL JOIN types are INNER, LEFT, RIGHT, and FULL OUTER JOIN. "TOP JOIN" does not exist.'],
      ['m', 'Which SQL statements are used for defining or modifying database structure? (Select all that apply)',
        ['CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'SELECT * FROM table', 'TRUNCATE TABLE'], [0, 1, 2, 4],
        'CREATE TABLE, ALTER TABLE, DROP TABLE, and TRUNCATE TABLE are DDL statements. SELECT is DML.'],
    ],
  },
  {
    title: 'Algorithms & Data Structures',
    slug: 'algorithms-data-structures',
    description: 'Test your knowledge of fundamental algorithms, complexity analysis, and data structures',
    category: 'programming', timeLimit: 18, difficulty: 4,
    imageFile: 'quiz-algorithms.jpg',
    imageKeyword: 'algorithm,computing,logic,programming,binary',
    questions: [
      ['s', 'What is the time complexity of binary search?',
        ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], 1,
        'Binary search has O(log n) complexity because it halves the search space at each step.'],
      ['s', 'Which data structure follows the LIFO (Last In, First Out) principle?',
        ['Queue', 'Stack', 'Linked List', 'Tree'], 1,
        'A Stack follows LIFO — the last item pushed is the first item popped.'],
      ['s', 'Which data structure follows the FIFO (First In, First Out) principle?',
        ['Stack', 'Queue', 'Binary Tree', 'Hash Map'], 1,
        'A Queue follows FIFO — the first item enqueued is the first item dequeued.'],
      ['s', 'What is the time complexity of accessing an element in an array by its index?',
        ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], 2,
        'Array index access is O(1) — constant time — due to direct memory addressing.'],
      ['s', 'What is the average time complexity for a lookup in a hash table?',
        ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], 2,
        'Hash tables provide O(1) average time for lookups using hashing.'],
      ['s', 'Which best describes a Linked List?',
        ['Elements stored in contiguous memory', 'Nodes connected via pointers/references', 'Elements stored as key-value pairs', 'A hierarchical structure of nodes'], 1,
        'A Linked List consists of nodes, each containing data and a pointer to the next node.'],
      ['m', 'Which sorting algorithms have O(n log n) average time complexity? (Select all that apply)',
        ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Bubble Sort', 'Selection Sort'], [0, 1, 2],
        'Merge Sort, Quick Sort, and Heap Sort have O(n log n) average complexity. Bubble and Selection Sort are O(n²).'],
      ['m', 'Which of the following are non-linear data structures? (Select all that apply)',
        ['Array', 'Tree', 'Graph', 'Stack', 'Linked List'], [1, 2],
        'Trees and Graphs are non-linear. Arrays, Stacks, and Linked Lists are linear data structures.'],
      ['m', 'Which are valid graph traversal algorithms? (Select all that apply)',
        ['BFS (Breadth-First Search)', 'DFS (Depth-First Search)', 'IFS (Index-First Search)', 'PFS (Pattern-First Search)'], [0, 1],
        'BFS and DFS are the two standard graph traversal algorithms. IFS and PFS do not exist.'],
      ['m', 'Which are properties of a Binary Search Tree (BST)? (Select all that apply)',
        ['Left child is smaller than parent', 'Right child is greater than parent', 'Each node has exactly two children', 'Allows O(log n) search on average'], [0, 1, 3],
        'A BST has left < parent and right > parent, and allows O(log n) average search. Nodes can have 0, 1, or 2 children.'],
    ],
  },

  // ========== SCIENCE ==========
  {
    title: 'Biology Fundamentals',
    slug: 'biology-fundamentals',
    description: 'Explore the core concepts of biology, from cells to genetics and evolution',
    category: 'science', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-biology.jpg',
    imageKeyword: 'biology,cell,microscope,science,nature',
    questions: [
      ['s', 'What is the basic unit of life?',
        ['Atom', 'Cell', 'Molecule', 'Tissue'], 1,
        'The cell is the basic structural and functional unit of all living organisms.'],
      ['s', 'Which organelle is known as the "powerhouse of the cell"?',
        ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], 2,
        'Mitochondria produce ATP through cellular respiration, earning the nickname "powerhouse of the cell."'],
      ['s', 'What is the process by which plants make food using sunlight?',
        ['Respiration', 'Fermentation', 'Photosynthesis', 'Transpiration'], 2,
        'Photosynthesis uses sunlight, water, and CO₂ to produce glucose and oxygen.'],
      ['s', 'Which scientist is credited with the theory of natural selection?',
        ['Gregor Mendel', 'Louis Pasteur', 'Charles Darwin', 'Isaac Newton'], 2,
        'Charles Darwin proposed natural selection in "On the Origin of Species" (1859).'],
      ['s', 'What is the largest organ of the human body?',
        ['Liver', 'Brain', 'Heart', 'Skin'], 3,
        'The skin is the largest organ, covering approximately 2 square meters in adults.'],
      ['s', 'Which molecule carries oxygen in red blood cells?',
        ['Hemoglobin', 'Insulin', 'DNA', 'ATP'], 0,
        'Hemoglobin is the iron-containing protein that binds and transports oxygen throughout the body.'],
      ['m', 'Which are the four nucleotide bases in DNA? (Select all that apply)',
        ['Adenine', 'Thymine', 'Guanine', 'Cytosine', 'Uracil'], [0, 1, 2, 3],
        'DNA contains Adenine, Thymine, Guanine, and Cytosine. Uracil is found in RNA, not DNA.'],
      ['m', 'Which structures are found in plant cells but NOT in animal cells? (Select all that apply)',
        ['Cell wall', 'Chloroplast', 'Large central vacuole', 'Mitochondria', 'Nucleus'], [0, 1, 2],
        'Plant cells have cell walls, chloroplasts, and large central vacuoles. Mitochondria and nuclei are in both cell types.'],
      ['m', 'Which of the following are types of blood cells? (Select all that apply)',
        ['Red blood cells (erythrocytes)', 'White blood cells (leukocytes)', 'Platelets (thrombocytes)', 'Muscle cells', 'Neurons'], [0, 1, 2],
        'Blood contains red blood cells, white blood cells, and platelets. Muscle cells and neurons are not blood cells.'],
      ['m', 'Which are examples of inherited traits in humans? (Select all that apply)',
        ['Eye color', 'Blood type', 'Attached or free earlobes', 'Language spoken', 'Cultural preferences'], [0, 1, 2],
        'Eye color, blood type, and earlobe shape are genetically inherited. Language and cultural preferences are learned.'],
    ],
  },
  {
    title: 'Chemistry Basics',
    slug: 'chemistry-basics',
    description: 'Test your understanding of fundamental chemistry concepts, elements, and reactions',
    category: 'science', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-chemistry.jpg',
    imageKeyword: 'chemistry,lab,molecules,science,experiment',
    questions: [
      ['s', 'What is the chemical symbol for gold?',
        ['Go', 'Gd', 'Au', 'Ag'], 2,
        'Gold\'s symbol Au comes from the Latin word "aurum."'],
      ['s', 'How many protons does a carbon atom have?',
        ['4', '6', '8', '12'], 1,
        'Carbon has atomic number 6, meaning it has 6 protons in its nucleus.'],
      ['s', 'What is the pH of pure water?',
        ['0', '5', '7', '14'], 2,
        'Pure water has a pH of 7, which is neutral — neither acidic nor basic.'],
      ['s', 'What is the smallest unit of a chemical element that retains its properties?',
        ['Molecule', 'Atom', 'Electron', 'Proton'], 1,
        'An atom is the smallest unit of an element that still retains that element\'s chemical properties.'],
      ['s', 'What type of chemical bond is formed by sharing electrons between atoms?',
        ['Ionic bond', 'Metallic bond', 'Covalent bond', 'Hydrogen bond'], 2,
        'A covalent bond forms when atoms share electrons to achieve a stable electron configuration.'],
      ['s', 'What is the chemical formula for water?',
        ['HO', 'H₂O', 'OH', 'H₂O₂'], 1,
        'Water is H₂O — two hydrogen atoms bonded to one oxygen atom.'],
      ['m', 'Which of the following are noble gases? (Select all that apply)',
        ['Helium', 'Neon', 'Argon', 'Oxygen', 'Hydrogen'], [0, 1, 2],
        'Noble gases (Group 18) include Helium, Neon, Argon, Krypton, Xenon, and Radon. Oxygen and Hydrogen are reactive.'],
      ['m', 'Which are the states of matter? (Select all that apply)',
        ['Solid', 'Liquid', 'Gas', 'Plasma', 'Crystal'], [0, 1, 2, 3],
        'The four states of matter are solid, liquid, gas, and plasma. Crystal is a structural form, not a state of matter.'],
      ['m', 'Which of the following are types of chemical reactions? (Select all that apply)',
        ['Synthesis', 'Decomposition', 'Combustion', 'Displacement', 'Evolution'], [0, 1, 2, 3],
        'Types of chemical reactions include synthesis, decomposition, combustion, and displacement. "Evolution" is not a chemical reaction type.'],
      ['m', 'Which elements are in the same group as Sodium (Na) on the periodic table? (Select all that apply)',
        ['Lithium (Li)', 'Potassium (K)', 'Calcium (Ca)', 'Magnesium (Mg)', 'Cesium (Cs)'], [0, 1, 4],
        'Sodium is in Group 1 (alkali metals) with Lithium, Potassium, and Cesium. Calcium and Magnesium are in Group 2.'],
    ],
  },
  {
    title: 'Physics Principles',
    slug: 'physics-principles',
    description: 'Challenge your knowledge of fundamental physics laws, forces, and energy concepts',
    category: 'science', timeLimit: 15, difficulty: 3,
    imageFile: 'quiz-physics.jpg',
    imageKeyword: 'physics,science,energy,electricity,experiment',
    questions: [
      ['s', 'Newton\'s First Law states an object remains at rest or in uniform motion unless acted upon by:',
        ['Friction', 'An unbalanced external force', 'Gravity alone', 'Temperature changes'], 1,
        'Newton\'s First Law (Law of Inertia): an object maintains its state unless an unbalanced external force acts on it.'],
      ['s', 'What is the SI unit of electrical resistance?',
        ['Volt', 'Ampere', 'Ohm (Ω)', 'Watt'], 2,
        'Electrical resistance is measured in Ohms (Ω), named after physicist Georg Simon Ohm.'],
      ['s', 'What is the formula for Newton\'s Second Law of Motion?',
        ['F = mv', 'F = ma', 'F = m/a', 'F = m + a'], 1,
        'Newton\'s Second Law: Force = mass × acceleration (F = ma).'],
      ['s', 'What is the SI unit of electric current?',
        ['Volt', 'Ohm', 'Watt', 'Ampere (A)'], 3,
        'Electric current is measured in Amperes (A), named after André-Marie Ampère.'],
      ['s', 'What phenomenon causes light to bend when passing from one medium to another?',
        ['Reflection', 'Diffraction', 'Refraction', 'Absorption'], 2,
        'Refraction is the bending of light as it passes between media due to a change in speed.'],
      ['s', 'What is the approximate speed of light in a vacuum?',
        ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'], 1,
        'The speed of light in a vacuum is approximately 299,792,458 m/s, or about 3 × 10⁸ m/s.'],
      ['m', 'Which of the following are types of electromagnetic waves? (Select all that apply)',
        ['Radio waves', 'X-rays', 'Gamma rays', 'Microwaves', 'Sound waves'], [0, 1, 2, 3],
        'Radio, X-rays, Gamma rays, and Microwaves are electromagnetic radiation. Sound waves require a medium and are not EM waves.'],
      ['m', 'Which are forms of energy? (Select all that apply)',
        ['Kinetic energy', 'Potential energy', 'Thermal energy', 'Chemical energy', 'Mythical energy'], [0, 1, 2, 3],
        'Kinetic, potential, thermal, and chemical energy are all real forms. "Mythical energy" does not exist scientifically.'],
      ['m', 'Which accurately describe Newton\'s Laws of Motion? (Select all that apply)',
        ['First Law: Objects resist changes in motion (inertia)', 'Second Law: Force = mass × acceleration', 'Third Law: Every action has an equal and opposite reaction', 'Fourth Law: Energy is always conserved'], [0, 1, 2],
        'Newton has three laws of motion. Conservation of energy is a separate principle, not one of Newton\'s Laws.'],
      ['m', 'Which statements about electromagnetic waves are correct? (Select all that apply)',
        ['They can travel through a vacuum', 'They travel at the speed of light in vacuum', 'They require a medium to travel', 'They carry both electric and magnetic fields'], [0, 1, 3],
        'EM waves travel through a vacuum at the speed of light carrying electric and magnetic fields. They do NOT require a medium.'],
    ],
  },
  {
    title: 'Astronomy & Space',
    slug: 'astronomy-and-space',
    description: 'Explore the universe — from our solar system to black holes and distant galaxies',
    category: 'science', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-astronomy.jpg',
    imageKeyword: 'space,astronomy,galaxy,stars,universe',
    questions: [
      ['s', 'What is the closest star to Earth?',
        ['Alpha Centauri', 'Sirius', 'The Sun', 'Proxima Centauri'], 2,
        'The Sun is the closest star at ~150 million km. Proxima Centauri is the closest star beyond our Sun.'],
      ['s', 'How long does it take for light from the Sun to reach Earth?',
        ['1 minute', '8 minutes', '1 hour', '1 day'], 1,
        'Sunlight takes about 8 minutes and 20 seconds to travel from the Sun to Earth.'],
      ['s', 'What is the name of the galaxy that contains our solar system?',
        ['Andromeda', 'Milky Way', 'Triangulum', 'Sombrero'], 1,
        'Our solar system is located in the Milky Way galaxy.'],
      ['s', 'What is a light-year?',
        ['The time for light to travel from the Sun to Earth', 'The distance light travels in one year', 'The speed of light', 'One billion kilometers'], 1,
        'A light-year is the distance light travels in one year — approximately 9.46 × 10¹² km.'],
      ['s', 'What primarily causes the seasons on Earth?',
        ['Earth\'s varying distance from the Sun', 'Earth\'s axial tilt', 'The Moon\'s gravitational pull', 'Solar flares'], 1,
        'Earth\'s axial tilt of ~23.5° causes different parts to receive varying amounts of sunlight, creating seasons.'],
      ['s', 'What is a black hole?',
        ['A dark region in space with no stars', 'A region where gravity is so strong that even light cannot escape', 'A type of dying star with no energy', 'A large asteroid'], 1,
        'A black hole is a region where gravity is so extreme that nothing — including light — can escape.'],
      ['m', 'Which of these are planets in the solar system? (Select all that apply)',
        ['Mercury', 'Venus', 'Pluto', 'Neptune', 'Ceres'], [0, 1, 3],
        'Mercury, Venus, and Neptune are planets. Pluto and Ceres are classified as dwarf planets.'],
      ['m', 'Which are types of galaxies? (Select all that apply)',
        ['Spiral', 'Elliptical', 'Irregular', 'Rectangular', 'Cubic'], [0, 1, 2],
        'Galaxies are classified as spiral, elliptical, or irregular. Rectangular and cubic galaxies do not exist.'],
      ['m', 'Which are layers of the Sun? (Select all that apply)',
        ['Core', 'Radiative zone', 'Convective zone', 'Photosphere', 'Corona'], [0, 1, 2, 3, 4],
        'The Sun\'s layers from center outward: Core, Radiative zone, Convective zone, Photosphere, Chromosphere, Corona. All five are correct.'],
      ['m', 'Which statements about Earth\'s Moon are correct? (Select all that apply)',
        ['It is Earth\'s only natural satellite', 'It has virtually no atmosphere', 'Neil Armstrong was the first human on the Moon', 'It produces its own light'], [0, 1, 2],
        'The Moon is Earth\'s only satellite, has no atmosphere, and Armstrong landed on it in 1969. The Moon reflects sunlight — it produces no light of its own.'],
    ],
  },

  // ========== GEOGRAPHY ==========
  {
    title: 'World Capitals Mastery',
    slug: 'world-capitals-mastery',
    description: 'How well do you know the capital cities of nations around the world?',
    category: 'geography', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-world-capitals.jpg',
    imageKeyword: 'world,map,globe,capitals,cities',
    questions: [
      ['s', 'What is the capital of France?',
        ['Lyon', 'Marseille', 'Paris', 'Nice'], 2,
        'Paris is the capital and largest city of France.'],
      ['s', 'What is the capital of Australia?',
        ['Sydney', 'Melbourne', 'Brisbane', 'Canberra'], 3,
        'Canberra is Australia\'s capital. Sydney is the largest city, but not the capital.'],
      ['s', 'What is the capital of Brazil?',
        ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], 2,
        'Brasília is the capital of Brazil, built as a planned city and inaugurated in 1960.'],
      ['s', 'What is the capital of Russia?',
        ['St. Petersburg', 'Moscow', 'Novosibirsk', 'Vladivostok'], 1,
        'Moscow is the capital of Russia and its most populous city.'],
      ['s', 'What is the capital of Egypt?',
        ['Alexandria', 'Luxor', 'Aswan', 'Cairo'], 3,
        'Cairo is the capital of Egypt and the largest city in Africa.'],
      ['s', 'What is the capital of Canada?',
        ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'], 3,
        'Ottawa is the capital of Canada. Toronto is the largest city.'],
      ['s', 'What is the capital of India?',
        ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], 1,
        'New Delhi is the capital of India and the seat of the Indian government.'],
      ['s', 'What is the capital of South Korea?',
        ['Busan', 'Incheon', 'Seoul', 'Daegu'], 2,
        'Seoul is the capital and largest city of South Korea.'],
      ['m', 'Which of these are capitals of African nations? (Select all that apply)',
        ['Nairobi (Kenya)', 'Cairo (Egypt)', 'Accra (Ghana)', 'Sydney (Australia)', 'Toronto (Canada)'], [0, 1, 2],
        'Nairobi, Cairo, and Accra are African capital cities. Sydney is in Australia; Toronto is in Canada.'],
      ['m', 'Which are correct capital-country pairings? (Select all that apply)',
        ['Tokyo – Japan', 'Beijing – China', 'Bangkok – Thailand', 'Sydney – Australia', 'Dublin – France'], [0, 1, 2],
        'Tokyo (Japan), Beijing (China), and Bangkok (Thailand) are correct. Sydney is NOT Australia\'s capital (Canberra is); Dublin is Ireland\'s capital, not France\'s (Paris).'],
    ],
  },
  {
    title: 'Asian Geography',
    slug: 'asian-geography',
    description: 'Explore the diverse countries, rivers, mountains, and cities across the Asian continent',
    category: 'geography', timeLimit: 12, difficulty: 3,
    imageFile: 'quiz-asian-geography.jpg',
    imageKeyword: 'asia,geography,mountains,culture,map',
    questions: [
      ['s', 'Which is the largest country in Asia by land area (located entirely in Asia)?',
        ['India', 'China', 'Australia', 'Saudi Arabia'], 1,
        'China is the largest country located entirely in Asia, covering approximately 9.6 million km².'],
      ['s', 'What is the longest river in Asia?',
        ['Ganges', 'Mekong', 'Yellow River', 'Yangtze River'], 3,
        'The Yangtze River is Asia\'s longest river at approximately 6,300 km.'],
      ['s', 'What is the world\'s highest mountain, located in Asia?',
        ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], 2,
        'Mount Everest in the Himalayas stands at 8,849 meters — the highest point on Earth.'],
      ['s', 'Which ocean borders East Asia to the east?',
        ['Indian Ocean', 'Atlantic Ocean', 'Arctic Ocean', 'Pacific Ocean'], 3,
        'The Pacific Ocean borders the eastern coastlines of East Asia.'],
      ['s', 'Which country had the largest population in the world as of 2024?',
        ['China', 'India', 'United States', 'Indonesia'], 1,
        'India surpassed China to become the world\'s most populous country in 2023.'],
      ['s', 'What is the capital of Japan?',
        ['Osaka', 'Kyoto', 'Tokyo', 'Hiroshima'], 2,
        'Tokyo is the capital of Japan and one of the largest urban areas in the world.'],
      ['m', 'Which are Southeast Asian countries? (Select all that apply)',
        ['Thailand', 'Vietnam', 'Indonesia', 'China', 'India'], [0, 1, 2],
        'Thailand, Vietnam, and Indonesia are Southeast Asian. China is East Asia; India is South Asia.'],
      ['m', 'Which of the following cities are located in China? (Select all that apply)',
        ['Beijing', 'Shanghai', 'Guangzhou', 'Tokyo', 'Seoul'], [0, 1, 2],
        'Beijing, Shanghai, and Guangzhou are Chinese cities. Tokyo is in Japan; Seoul is in South Korea.'],
      ['m', 'Which countries share a land border with China? (Select all that apply)',
        ['Russia', 'India', 'Mongolia', 'Japan', 'Australia'], [0, 1, 2],
        'China shares land borders with Russia, India, Mongolia, and 11 other countries. Japan and Australia are separated by ocean.'],
      ['m', 'Which are major rivers flowing through South or Southeast Asia? (Select all that apply)',
        ['Mekong', 'Ganges', 'Indus', 'Volga', 'Rhine'], [0, 1, 2],
        'The Mekong (Southeast Asia), Ganges (India), and Indus (Pakistan/India) are major Asian rivers. Volga and Rhine are European rivers.'],
    ],
  },
  {
    title: 'European Countries',
    slug: 'european-countries',
    description: 'Test your knowledge of Europe\'s nations, capitals, geography, and culture',
    category: 'geography', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-european-countries.jpg',
    imageKeyword: 'europe,countries,map,cities,culture',
    questions: [
      ['s', 'How many member states does the European Union have as of 2024?',
        ['25', '27', '30', '31'], 1,
        'The EU has 27 member states following the United Kingdom\'s departure (Brexit) in 2020.'],
      ['s', 'What is the smallest country in Europe (and in the world)?',
        ['Monaco', 'San Marino', 'Liechtenstein', 'Vatican City'], 3,
        'Vatican City (~0.44 km²) is both the smallest country in Europe and worldwide.'],
      ['s', 'What is the longest river in Europe?',
        ['Danube', 'Rhine', 'Seine', 'Volga'], 3,
        'The Volga River in Russia is the longest in Europe at approximately 3,530 km.'],
      ['s', 'In which country is the Eiffel Tower located?',
        ['Belgium', 'Italy', 'Germany', 'France'], 3,
        'The Eiffel Tower is located in Paris, France.'],
      ['s', 'What is the capital of Spain?',
        ['Barcelona', 'Seville', 'Madrid', 'Valencia'], 2,
        'Madrid is the capital and largest city of Spain.'],
      ['s', 'What is the capital of the Netherlands?',
        ['Rotterdam', 'The Hague', 'Utrecht', 'Amsterdam'], 3,
        'Amsterdam is the capital of the Netherlands, though The Hague is the seat of government.'],
      ['m', 'Which are traditionally considered Scandinavian countries? (Select all that apply)',
        ['Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland'], [0, 1, 2],
        'Norway, Sweden, and Denmark are the three traditionally recognized Scandinavian countries. Finland and Iceland are Nordic but not classically Scandinavian.'],
      ['m', 'Which countries use the Euro (€) as their official currency? (Select all that apply)',
        ['Germany', 'France', 'Norway', 'Switzerland', 'Italy'], [0, 1, 4],
        'Germany, France, and Italy use the Euro. Norway uses the Norwegian Krone; Switzerland uses the Swiss Franc.'],
      ['m', 'Which are correct capital-country pairings in Europe? (Select all that apply)',
        ['Rome – Italy', 'Vienna – Austria', 'Athens – Greece', 'Brussels – France'], [0, 1, 2],
        'Rome (Italy), Vienna (Austria), and Athens (Greece) are correct. Brussels is Belgium\'s capital, not France\'s.'],
      ['m', 'Which countries are part of the United Kingdom? (Select all that apply)',
        ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Republic of Ireland'], [0, 1, 2, 3],
        'The UK consists of England, Scotland, Wales, and Northern Ireland. The Republic of Ireland is an independent country.'],
    ],
  },
  {
    title: 'Natural Wonders of the World',
    slug: 'natural-wonders-world',
    description: 'Discover Earth\'s most breathtaking natural wonders and extraordinary phenomena',
    category: 'geography', timeLimit: 10, difficulty: 2,
    imageFile: 'quiz-natural-wonders.jpg',
    imageKeyword: 'nature,waterfall,mountains,landscape,wonder',
    questions: [
      ['s', 'In which country is the Grand Canyon located?',
        ['Canada', 'Mexico', 'United States', 'Australia'], 2,
        'The Grand Canyon is located in Arizona, United States.'],
      ['s', 'What is the largest coral reef system in the world?',
        ['Belize Barrier Reef', 'Coral Triangle', 'Great Barrier Reef', 'Florida Reef'], 2,
        'The Great Barrier Reef in Australia stretches over 2,300 km — the world\'s largest coral reef.'],
      ['s', 'On which continent is the Amazon Rainforest primarily located?',
        ['Africa', 'Asia', 'North America', 'South America'], 3,
        'The Amazon Rainforest is primarily in South America, mostly within Brazil.'],
      ['s', 'What is the deepest lake in the world?',
        ['Lake Superior', 'Lake Titicaca', 'Lake Baikal', 'Caspian Sea'], 2,
        'Lake Baikal in Russia is the world\'s deepest lake, reaching 1,642 meters.'],
      ['s', 'What is the largest island in the world?',
        ['Australia', 'New Guinea', 'Borneo', 'Greenland'], 3,
        'Greenland is the world\'s largest island at 2.166 million km². Australia is classified as a continent.'],
      ['s', 'Where is the Sahara Desert primarily located?',
        ['Southern Africa', 'Middle East', 'North Africa', 'Central Asia'], 2,
        'The Sahara Desert covers most of North Africa and is the world\'s largest hot desert.'],
      ['m', 'Which are Seven Natural Wonders of the World? (Select all that apply)',
        ['Grand Canyon', 'Great Barrier Reef', 'Mount Everest', 'Victoria Falls', 'Eiffel Tower'], [0, 1, 2, 3],
        'The Seven Natural Wonders include Grand Canyon, Great Barrier Reef, Mount Everest, Victoria Falls, Amazon, Aurora Borealis, and Paricutin. The Eiffel Tower is man-made.'],
      ['m', 'Which are active volcanoes? (Select all that apply)',
        ['Mount Vesuvius (Italy)', 'Kilauea (Hawaii)', 'Mount Etna (Italy)', 'Mount Everest', 'Mauna Loa (Hawaii)'], [0, 1, 2, 4],
        'Vesuvius, Kilauea, Etna, and Mauna Loa are active volcanoes. Mount Everest is a non-volcanic mountain.'],
      ['m', 'Which facts about the Nile River are correct? (Select all that apply)',
        ['It is the longest river in Africa', 'It flows through Egypt', 'It empties into the Mediterranean Sea', 'It flows through South America'], [0, 1, 2],
        'The Nile is Africa\'s longest river, flows through Egypt, and empties into the Mediterranean. The Amazon is in South America.'],
      ['m', 'Which statements about the Aurora Borealis (Northern Lights) are correct? (Select all that apply)',
        ['Caused by charged solar particles colliding with the atmosphere', 'Best seen near polar regions', 'Appears as colored light in the sky', 'Caused by earthquakes'], [0, 1, 2],
        'Auroras are caused by solar particles interacting with Earth\'s magnetosphere, seen near polar regions. They are not related to earthquakes.'],
    ],
  },

  // ========== HISTORY ==========
  {
    title: 'Ancient Civilizations',
    slug: 'ancient-civilizations',
    description: 'Journey back in time and test your knowledge of the world\'s great ancient civilizations',
    category: 'history', timeLimit: 15, difficulty: 3,
    imageFile: 'quiz-ancient-civilizations.jpg',
    imageKeyword: 'ancient,civilization,ruins,pyramid,egypt',
    questions: [
      ['s', 'Which ancient civilization built the Great Pyramids of Giza?',
        ['Ancient Greeks', 'Ancient Romans', 'Ancient Egyptians', 'Mesopotamians'], 2,
        'The Great Pyramids were built by ancient Egyptians as tombs for their pharaohs.'],
      ['s', 'Who was the first Emperor of Rome?',
        ['Julius Caesar', 'Nero', 'Augustus (Octavian)', 'Constantine'], 2,
        'Augustus (born Octavian) became the first Roman Emperor in 27 BC.'],
      ['s', 'Which Greek philosopher wrote the dialogue "The Republic"?',
        ['Aristotle', 'Socrates', 'Plato', 'Pythagoras'], 2,
        'Plato wrote "The Republic," presenting dialogues about justice and the ideal state.'],
      ['s', 'What ancient wonder was said to be located in Babylon?',
        ['Colossus of Rhodes', 'Temple of Artemis', 'Hanging Gardens of Babylon', 'Lighthouse of Alexandria'], 2,
        'The Hanging Gardens of Babylon were one of the Seven Wonders of the Ancient World.'],
      ['s', 'Which river did ancient Egyptian civilization develop along?',
        ['Tigris', 'Euphrates', 'Jordan', 'Nile'], 3,
        'Ancient Egyptian civilization flourished along the Nile River, whose annual floods enriched farmland.'],
      ['s', 'In which country is the ancient city of Pompeii located?',
        ['Greece', 'Turkey', 'Italy', 'Egypt'], 2,
        'Pompeii was a Roman city near Naples, Italy, destroyed by Mount Vesuvius in 79 AD.'],
      ['m', 'Which were major ancient empires? (Select all that apply)',
        ['Roman Empire', 'Persian Empire', 'Mongol Empire', 'Byzantine Empire', 'United States Empire'], [0, 1, 2, 3],
        'The Roman, Persian, Mongol, and Byzantine Empires were major ancient empires. The United States did not exist in ancient history.'],
      ['m', 'Which are known contributions of ancient Rome? (Select all that apply)',
        ['Concrete roads and construction', 'Aqueducts (water channels)', 'Roman numerals', 'Gunpowder', 'Foundations of modern law'], [0, 1, 2, 4],
        'Rome contributed concrete roads, aqueducts, Roman numerals, and foundations of modern law. Gunpowder was invented in China.'],
      ['m', 'Which ancient civilizations developed early writing systems? (Select all that apply)',
        ['Sumerians (cuneiform)', 'Egyptians (hieroglyphics)', 'Phoenicians (early alphabet)', 'Vikings', 'Celts'], [0, 1, 2],
        'Sumerians, Egyptians, and Phoenicians developed early writing. Vikings had runes; Celts are not credited with one of the earliest systems.'],
      ['m', 'Which are accurate descriptions of Alexander the Great? (Select all that apply)',
        ['He was a Macedonian king', 'He conquered the Persian Empire', 'He was a student of Aristotle', 'He was born in Rome'], [0, 1, 2],
        'Alexander was a Macedonian king, conquered Persia, and was tutored by Aristotle. He was born in Pella, Macedonia — not Rome.'],
    ],
  },
  {
    title: 'World Wars',
    slug: 'world-wars-history',
    description: 'Test your knowledge of the causes, battles, and outcomes of both World Wars',
    category: 'history', timeLimit: 15, difficulty: 3,
    imageFile: 'quiz-world-wars.jpg',
    imageKeyword: 'war,history,military,memorial,wwii',
    questions: [
      ['s', 'In what year did World War I begin?',
        ['1910', '1912', '1914', '1916'], 2,
        'WWI began in 1914 following the assassination of Archduke Franz Ferdinand.'],
      ['s', 'What event directly triggered the start of World War I?',
        ['The sinking of the Lusitania', 'The assassination of Archduke Franz Ferdinand', 'Germany\'s invasion of France', 'The Treaty of Versailles'], 1,
        'The assassination of Austro-Hungarian heir Archduke Franz Ferdinand in Sarajevo on June 28, 1914, triggered the war.'],
      ['s', 'In what year did World War II end?',
        ['1943', '1944', '1945', '1946'], 2,
        'WWII ended in 1945: Germany surrendered May 8 (V-E Day) and Japan September 2 (V-J Day).'],
      ['s', 'Where did the major Allied D-Day invasion take place on June 6, 1944?',
        ['Belgium', 'The Netherlands', 'Italy', 'Normandy, France'], 3,
        'Operation Overlord — D-Day — landed on the beaches of Normandy, France.'],
      ['s', 'Who was the leader of Nazi Germany during World War II?',
        ['Joseph Goebbels', 'Hermann Göring', 'Adolf Hitler', 'Heinrich Himmler'], 2,
        'Adolf Hitler was the Führer of Nazi Germany from 1933 until his death in 1945.'],
      ['s', 'What was the code name for Germany\'s invasion of the Soviet Union in 1941?',
        ['Operation Sea Lion', 'Operation Overlord', 'Operation Barbarossa', 'Operation Market Garden'], 2,
        'Operation Barbarossa was Nazi Germany\'s massive invasion of the Soviet Union, launched June 22, 1941.'],
      ['m', 'Which countries were Allied Powers in World War II? (Select all that apply)',
        ['United States', 'United Kingdom', 'Soviet Union (USSR)', 'Germany', 'Italy'], [0, 1, 2],
        'The main Allied Powers were the USA, UK, and USSR. Germany and Italy were Axis Powers.'],
      ['m', 'Which countries were Axis Powers in World War II? (Select all that apply)',
        ['Germany', 'Italy', 'Japan', 'United States', 'Soviet Union'], [0, 1, 2],
        'The Axis Powers were Germany, Italy, and Japan. The USA and USSR were Allied Powers.'],
      ['m', 'Which were significant battles of World War I? (Select all that apply)',
        ['Battle of the Somme', 'Battle of Verdun', 'Battle of the Marne', 'Battle of Stalingrad', 'Battle of Midway'], [0, 1, 2],
        'The Somme, Verdun, and the Marne were major WWI battles. Stalingrad and Midway were WWII battles.'],
      ['m', 'Which are true statements about the Treaty of Versailles (1919)? (Select all that apply)',
        ['It officially ended World War I', 'It placed war guilt on Germany (War Guilt Clause)', 'It established the League of Nations', 'It was signed in 1939'], [0, 1, 2],
        'The Treaty of Versailles (1919) ended WWI, blamed Germany, and created the League of Nations. It was signed in 1919, not 1939.'],
    ],
  },
  {
    title: 'Modern History',
    slug: 'modern-history-20th-century',
    description: 'Test your knowledge of the key events that shaped the 20th century and modern world',
    category: 'history', timeLimit: 15, difficulty: 3,
    imageFile: 'quiz-modern-history.jpg',
    imageKeyword: 'history,modern,20th,century,events',
    questions: [
      ['s', 'In what year did the Berlin Wall fall?',
        ['1985', '1987', '1989', '1991'], 2,
        'The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War era.'],
      ['s', 'Who was the first person to walk on the Moon?',
        ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'John Glenn'], 2,
        'Neil Armstrong became the first human on the Moon on July 20, 1969, during Apollo 11.'],
      ['s', 'In what year did the Soviet Union dissolve?',
        ['1989', '1990', '1991', '1993'], 2,
        'The Soviet Union formally dissolved on December 25–26, 1991, when Gorbachev resigned.'],
      ['s', 'In what year was the United Nations founded?',
        ['1919', '1939', '1945', '1948'], 2,
        'The UN was founded in 1945 after World War II to promote international peace.'],
      ['s', 'Who led the non-violent Indian independence movement against British rule?',
        ['Jawaharlal Nehru', 'Subhas Chandra Bose', 'Mahatma Gandhi', 'Bhagat Singh'], 2,
        'Mahatma Gandhi led the non-violent civil disobedience movement that helped India gain independence in 1947.'],
      ['s', 'Who was the first woman to serve as Prime Minister of the United Kingdom?',
        ['Theresa May', 'Margaret Thatcher', 'Queen Elizabeth II', 'Nicola Sturgeon'], 1,
        'Margaret Thatcher became the UK\'s first female PM, serving from 1979 to 1990.'],
      ['s', 'In what year did Nelson Mandela become President of South Africa?',
        ['1990', '1992', '1994', '1996'], 2,
        'Nelson Mandela became South Africa\'s first democratically elected President in 1994.'],
      ['m', 'Which of the following were Cold War events? (Select all that apply)',
        ['Cuban Missile Crisis (1962)', 'Berlin Wall construction (1961)', 'Space Race (1957–1969)', 'Korean War (1950–53)', 'World War I'], [0, 1, 2, 3],
        'The Cuban Missile Crisis, Berlin Wall, Space Race, and Korean War were all Cold War events. WWI predated the Cold War.'],
      ['m', 'Which major events occurred in 1969? (Select all that apply)',
        ['First Moon landing (Apollo 11)', 'Woodstock Music Festival', 'Fall of the Berlin Wall', 'First AIDS cases reported'], [0, 1],
        'Apollo 11 and Woodstock both occurred in 1969. The Berlin Wall fell in 1989; AIDS emerged in the early 1980s.'],
      ['m', 'Which leaders were key figures in the Treaty of Versailles negotiations (1919)? (Select all that apply)',
        ['Woodrow Wilson (USA)', 'David Lloyd George (UK)', 'Georges Clemenceau (France)', 'Adolf Hitler (Germany)', 'Vladimir Lenin (Russia)'], [0, 1, 2],
        'Wilson, Lloyd George, and Clemenceau (the "Big Three") led the negotiations. Hitler was not a leader in 1919; Russia signed a separate peace earlier.'],
    ],
  },
  {
    title: 'American History',
    slug: 'american-history',
    description: 'From the founding fathers to the civil rights movement — explore the history of the USA',
    category: 'history', timeLimit: 15, difficulty: 3,
    imageFile: 'quiz-american-history.jpg',
    imageKeyword: 'america,history,usa,flag,independence',
    questions: [
      ['s', 'In what year was the United States Declaration of Independence signed?',
        ['1770', '1774', '1776', '1781'], 2,
        'The Declaration of Independence was formally adopted on July 4, 1776.'],
      ['s', 'Who was the first President of the United States?',
        ['Thomas Jefferson', 'John Adams', 'Benjamin Franklin', 'George Washington'], 3,
        'George Washington served as the first US President from 1789 to 1797.'],
      ['s', 'In what year did women gain the right to vote in the United States?',
        ['1900', '1910', '1920', '1930'], 2,
        'The 19th Amendment, granting women the right to vote, was ratified on August 18, 1920.'],
      ['s', 'What event triggered the start of the American Civil War in 1861?',
        ['The assassination of Abraham Lincoln', 'The attack on Fort Sumter', 'The Emancipation Proclamation', 'John Brown\'s raid on Harper\'s Ferry'], 1,
        'The Confederate attack on Fort Sumter, South Carolina in April 1861 is considered the start of the Civil War.'],
      ['s', 'Who delivered the famous "I Have a Dream" speech in 1963?',
        ['Malcolm X', 'John F. Kennedy', 'Thurgood Marshall', 'Martin Luther King Jr.'], 3,
        'Martin Luther King Jr. delivered "I Have a Dream" at the Lincoln Memorial on August 28, 1963.'],
      ['s', 'Which US president issued the Emancipation Proclamation in 1863?',
        ['Ulysses S. Grant', 'Abraham Lincoln', 'Andrew Johnson', 'James Buchanan'], 1,
        'President Lincoln issued the Emancipation Proclamation on January 1, 1863, declaring enslaved people in rebel states to be free.'],
      ['s', 'In what year did the United States enter World War II?',
        ['1939', '1940', '1941', '1942'], 2,
        'The US entered WWII in December 1941 following Japan\'s attack on Pearl Harbor on December 7.'],
      ['m', 'Which amendments are part of the original US Bill of Rights? (Select all that apply)',
        ['1st Amendment (freedom of speech/religion)', '2nd Amendment (right to bear arms)', '4th Amendment (protection from unreasonable searches)', '25th Amendment (presidential succession)'], [0, 1, 2],
        'The Bill of Rights comprises the first 10 amendments. The 25th Amendment (1967) is not part of the original Bill of Rights.'],
      ['m', 'Which were contributing factors to the Great Depression? (Select all that apply)',
        ['Stock market crash of 1929', 'Bank failures across the country', 'Drought and the Dust Bowl', 'Pearl Harbor attack'], [0, 1, 2],
        'The Depression was caused by the market crash, banking collapse, and drought. The Pearl Harbor attack occurred in 1941.'],
      ['m', 'Which of the following are powers of the US Congress? (Select all that apply)',
        ['Making federal laws', 'Approving the federal budget', 'Declaring war', 'Setting interest rates'], [0, 1, 2],
        'Congress makes laws, approves the budget, and can declare war. Setting interest rates is done by the Federal Reserve.'],
    ],
  },

  // ========== ANIMALS ==========
  {
    title: 'African Wildlife',
    slug: 'african-wildlife',
    description: 'Explore the incredible animals of the African continent and their remarkable behaviors',
    category: 'animals', timeLimit: 10, difficulty: 1,
    imageFile: 'quiz-african-wildlife.jpg',
    imageKeyword: 'africa,wildlife,safari,animals,savanna',
    questions: [
      ['s', 'What is the largest land animal on Earth?',
        ['Hippopotamus', 'White Rhinoceros', 'Giraffe', 'African Elephant'], 3,
        'The African elephant is the world\'s largest land animal, weighing up to 7 tonnes.'],
      ['s', 'Which big cat is the fastest land animal on Earth?',
        ['Lion', 'Leopard', 'Cheetah', 'Tiger'], 2,
        'The cheetah can reach speeds up to 120 km/h — the fastest land animal on Earth.'],
      ['s', 'What is a group of lions called?',
        ['A herd', 'A pack', 'A pride', 'A colony'], 2,
        'A group of lions is called a pride, typically consisting of related females, their cubs, and a few males.'],
      ['s', 'Which is the world\'s tallest and heaviest bird?',
        ['Emu', 'Cassowary', 'Ostrich', 'Pelican'], 2,
        'The ostrich is both the tallest (up to 2.8m) and heaviest (up to 160 kg) bird in the world.'],
      ['s', 'What is the largest big cat in the world by weight?',
        ['Lion', 'Leopard', 'Jaguar', 'Tiger'], 3,
        'The tiger is the largest living cat species — Siberian tigers can weigh up to 300 kg.'],
      ['s', 'What is the approximate gestation period of an African elephant?',
        ['9 months', '12 months', '18 months', '22 months'], 3,
        'African elephants have the longest pregnancy of any land animal — approximately 22 months.'],
      ['m', 'Which of the following animals are native to Africa? (Select all that apply)',
        ['Lion', 'Giraffe', 'Hippopotamus', 'Polar Bear', 'Giant Panda'], [0, 1, 2],
        'Lions, giraffes, and hippos are native to Africa. Polar bears live in the Arctic; giant pandas are native to China.'],
      ['m', 'Which African animals are herbivores? (Select all that apply)',
        ['Giraffe', 'Zebra', 'Elephant', 'Lion', 'Cheetah'], [0, 1, 2],
        'Giraffes, zebras, and elephants are herbivores. Lions and cheetahs are carnivores.'],
      ['m', 'Which animals are nocturnal (primarily active at night)? (Select all that apply)',
        ['Owl', 'Bat', 'Leopard', 'Aardvark', 'Cheetah'], [0, 1, 2, 3],
        'Owls, bats, leopards, and aardvarks are nocturnal. Cheetahs are primarily diurnal (active during the day).'],
      ['m', 'Which animals can be found in the African savanna? (Select all that apply)',
        ['African Wild Dog', 'Wildebeest', 'Warthog', 'Polar Bear', 'Koala'], [0, 1, 2],
        'African wild dogs, wildebeests, and warthogs are savanna animals. Polar bears and koalas are from other regions.'],
    ],
  },
  {
    title: 'Ocean & Marine Life',
    slug: 'ocean-marine-life',
    description: 'Dive into the world\'s oceans and discover the fascinating creatures of marine life',
    category: 'animals', timeLimit: 10, difficulty: 2,
    imageFile: 'quiz-ocean-marine.jpg',
    imageKeyword: 'ocean,marine,underwater,fish,sea',
    questions: [
      ['s', 'What is the largest ocean on Earth?',
        ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], 3,
        'The Pacific Ocean covers approximately 165 million km², making it the world\'s largest ocean.'],
      ['s', 'What is the largest animal on Earth?',
        ['African Elephant', 'Great White Shark', 'Blue Whale', 'Giant Squid'], 2,
        'The blue whale is the largest animal ever known, reaching up to 30 meters and 200 tonnes.'],
      ['s', 'What is the deepest known point in the ocean?',
        ['Puerto Rico Trench', 'Java Trench', 'Mariana Trench (Challenger Deep)', 'Tonga Trench'], 2,
        'The Challenger Deep in the Mariana Trench is the deepest known ocean point, at ~11,000 meters.'],
      ['s', 'What gas do fish absorb through their gills to survive?',
        ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], 2,
        'Fish absorb dissolved oxygen from water through their gills for cellular respiration.'],
      ['s', 'Approximately what percentage of Earth\'s surface water is in the oceans?',
        ['75%', '85%', '97%', '99%'], 2,
        'About 97% of Earth\'s water is saltwater in the oceans. Only ~3% is freshwater.'],
      ['s', 'What type of animal is a seahorse?',
        ['A reptile', 'A crustacean', 'A mollusk', 'A fish'], 3,
        'Despite their unusual appearance, seahorses (genus Hippocampus) are fish.'],
      ['m', 'Which of the following are types of sharks? (Select all that apply)',
        ['Great White Shark', 'Tiger Shark', 'Hammerhead Shark', 'Killer Whale', 'Mako Shark'], [0, 1, 2, 4],
        'Great White, Tiger, Hammerhead, and Mako are sharks. The Killer Whale (Orca) is actually a dolphin, not a shark.'],
      ['m', 'Which are characteristics of marine mammals? (Select all that apply)',
        ['Breathe air with lungs', 'Are warm-blooded', 'Give birth to live young', 'Breathe through gills'], [0, 1, 2],
        'Marine mammals breathe air, are warm-blooded, and bear live young. Breathing through gills is a fish trait.'],
      ['m', 'Which of the following are marine mammals? (Select all that apply)',
        ['Dolphin', 'Whale', 'Seal', 'Tuna', 'Sea Turtle'], [0, 1, 2],
        'Dolphins, whales, and seals are mammals. Tuna is a fish; sea turtles are reptiles.'],
      ['m', 'Which statements about coral reefs are correct? (Select all that apply)',
        ['Built by tiny animals called coral polyps', 'Support about 25% of all marine species', 'Threatened by rising ocean temperatures', 'Cover the majority of the ocean floor'], [0, 1, 2],
        'Corals are animals (polyps), reefs support ~25% of marine life, and warming causes bleaching. Reefs cover less than 1% of the ocean floor.'],
    ],
  },
  {
    title: 'Birds of the World',
    slug: 'birds-of-the-world',
    description: 'Discover the remarkable diversity of birds — from the smallest to the most majestic',
    category: 'animals', timeLimit: 10, difficulty: 2,
    imageFile: 'quiz-birds-world.jpg',
    imageKeyword: 'birds,wings,feathers,flight,nature',
    questions: [
      ['s', 'Which is the heaviest bird in the world?',
        ['Emu', 'Condor', 'Ostrich', 'Albatross'], 2,
        'The ostrich is both the world\'s heaviest and tallest bird, weighing up to 160 kg.'],
      ['s', 'Which bird is known for its spectacular, colorful tail feathers?',
        ['Flamingo', 'Toucan', 'Peacock', 'Parrot'], 2,
        'The peacock (male peafowl) displays iridescent tail feathers in elaborate courtship rituals.'],
      ['s', 'Which is the world\'s smallest bird?',
        ['Ruby-throated Hummingbird', 'Bee Hummingbird', 'Goldcrest', 'Bananaquit'], 1,
        'The Bee Hummingbird, native to Cuba, is the world\'s smallest bird at about 1.6 grams.'],
      ['s', 'Which bird is the national symbol of the United States?',
        ['Great Horned Owl', 'Wild Turkey', 'American Robin', 'Bald Eagle'], 3,
        'The Bald Eagle was adopted as the national bird of the United States in 1782.'],
      ['s', 'Which bird has the largest wingspan of any living bird?',
        ['Bald Eagle', 'California Condor', 'Wandering Albatross', 'Pelican'], 2,
        'The Wandering Albatross has the largest wingspan of any living bird, reaching up to 3.5 meters.'],
      ['s', 'Where do wild penguins live?',
        ['Only in Antarctica', 'Only in the Northern Hemisphere', 'The Southern Hemisphere', 'Only in the Arctic'], 2,
        'Wild penguins live exclusively in the Southern Hemisphere — Antarctica, South America, South Africa, New Zealand, and Australia.'],
      ['m', 'Which of the following birds are flightless? (Select all that apply)',
        ['Ostrich', 'Penguin', 'Emu', 'Kiwi', 'Eagle'], [0, 1, 2, 3],
        'Ostriches, penguins, emus, and kiwis are all flightless birds. Eagles are strong fliers.'],
      ['m', 'Which are characteristics of all birds? (Select all that apply)',
        ['Feathers', 'Beaks (bills)', 'Lay eggs', 'Hollow bones', 'Cold-blooded'], [0, 1, 2, 3],
        'All birds have feathers, beaks, lay eggs, and have hollow bones for flight. Birds are warm-blooded, not cold-blooded.'],
      ['m', 'Which birds are renowned for their exceptional singing ability? (Select all that apply)',
        ['Nightingale', 'Canary', 'Mockingbird', 'Lyrebird', 'Penguin'], [0, 1, 2, 3],
        'Nightingales, canaries, mockingbirds, and lyrebirds are celebrated songbirds. Penguins are not known for their singing.'],
      ['m', 'Which are true statements about bird migration? (Select all that apply)',
        ['Birds use Earth\'s magnetic field to navigate', 'Some birds travel thousands of miles seasonally', 'Birds migrate to find food and breeding grounds', 'All bird species migrate'], [0, 1, 2],
        'Birds use magnetic fields and celestial cues to navigate; many migrate long distances for food and breeding. However, not all species migrate.'],
    ],
  },
  {
    title: 'Endangered Species',
    slug: 'endangered-species',
    description: 'Learn about the world\'s most threatened wildlife and the global efforts to protect them',
    category: 'animals', timeLimit: 12, difficulty: 3,
    imageFile: 'quiz-endangered-species.jpg',
    imageKeyword: 'endangered,wildlife,conservation,rare,animals',
    questions: [
      ['s', 'Which organization publishes the Red List of Threatened Species?',
        ['WWF (World Wildlife Fund)', 'IUCN (International Union for Conservation of Nature)', 'UNEP (UN Environment Programme)', 'National Geographic Society'], 1,
        'The IUCN Red List is the world\'s most comprehensive inventory of species\' conservation status.'],
      ['s', 'What is the most common primary cause of species endangerment worldwide?',
        ['Hunting and poaching', 'Habitat loss and destruction', 'Climate change', 'Invasive species'], 1,
        'Habitat loss and destruction is the leading threat to biodiversity, affecting the majority of threatened species.'],
      ['s', 'What does the IUCN status "CR" stand for?',
        ['Common Rare', 'Critically Reduced', 'Critically Endangered', 'Currently Recovering'], 2,
        '"CR" stands for Critically Endangered — the highest risk category before extinction in the wild.'],
      ['s', 'In which century did the Dodo bird become extinct?',
        ['15th century', '16th century', '17th century', '18th century'], 2,
        'The Dodo, native to Mauritius, went extinct around 1681 due to hunting and invasive species introduced by sailors.'],
      ['s', 'What is the primary reason the Vaquita porpoise is critically endangered?',
        ['Ocean pollution', 'Bycatch in illegal fishing nets', 'Coastal development', 'Disease'], 1,
        'The Vaquita is critically endangered mainly due to being accidentally caught (bycatch) in illegal gillnets.'],
      ['s', 'Which turtle makes the longest migration of any known vertebrate?',
        ['Green Sea Turtle', 'Hawksbill Sea Turtle', 'Loggerhead Sea Turtle', 'Leatherback Sea Turtle'], 3,
        'Leatherback sea turtles migrate up to 16,000 km between feeding and nesting grounds — the longest vertebrate migration.'],
      ['m', 'Which of the following are classified as Critically Endangered? (Select all that apply)',
        ['Amur Leopard', 'Sumatran Orangutan', 'Vaquita', 'African Elephant', 'Gray Wolf'], [0, 1, 2],
        'Amur Leopard, Sumatran Orangutan, and Vaquita are Critically Endangered. African Elephants are Vulnerable; Gray Wolves are Least Concern.'],
      ['m', 'Which are major causes of species endangerment? (Select all that apply)',
        ['Habitat destruction', 'Poaching and illegal wildlife trade', 'Climate change', 'Invasive species', 'Natural evolution'], [0, 1, 2, 3],
        'Habitat loss, poaching, climate change, and invasive species are major threats. Natural evolution is a natural biological process, not a threat.'],
      ['m', 'Which conservation strategies effectively protect endangered species? (Select all that apply)',
        ['Establishing protected areas (national parks)', 'Captive breeding programs', 'Anti-poaching enforcement', 'Habitat restoration'], [0, 1, 2, 3],
        'Protected areas, captive breeding, anti-poaching enforcement, and habitat restoration are all proven conservation strategies.'],
      ['m', 'Which facts about tigers are correct? (Select all that apply)',
        ['There are 6 living tiger subspecies', 'Wild tiger populations have declined dramatically in the last century', 'Tigers are found only in Africa', 'Poaching is a major threat to tigers'], [0, 1, 3],
        'There are 6 surviving subspecies; populations have declined ~97% over a century; poaching is a key threat. Tigers are found in Asia, not Africa.'],
    ],
  },

  // ========== MUSIC ==========
  {
    title: 'Music Theory Basics',
    slug: 'music-theory-basics',
    description: 'Explore the fundamentals of music theory — notes, rhythm, scales, and harmony',
    category: 'music', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-music-theory.jpg',
    imageKeyword: 'music,theory,notes,piano,sheet',
    questions: [
      ['s', 'How many notes are in a major scale, including the octave?',
        ['5', '7', '8', '12'], 2,
        'A major scale contains 8 notes (do, re, mi, fa, sol, la, ti, do), with the 8th being the octave of the first.'],
      ['s', 'What does the dynamic marking "forte" (f) indicate in music?',
        ['Very slow tempo', 'Play loudly', 'Play softly', 'Gradually increase in volume'], 1,
        '"Forte" is an Italian musical term meaning strong/loud.'],
      ['s', 'How many beats are in one measure of a piece written in 4/4 time?',
        ['2', '3', '4', '8'], 2,
        'In 4/4 time, there are 4 beats per measure, with each quarter note receiving one beat.'],
      ['s', 'What does the tempo marking "allegro" mean?',
        ['Very slow', 'Moderately slow', 'Fast and lively', 'Very fast'], 2,
        '"Allegro" means fast and lively — typically 120–156 beats per minute.'],
      ['s', 'What is a chord in music?',
        ['A single musical note', 'Three or more notes played simultaneously', 'A musical rest (period of silence)', 'A type of musical scale'], 1,
        'A chord is the simultaneous playing of three or more different notes.'],
      ['s', 'What is the interval between two notes sharing the same name (e.g., C to C) called?',
        ['A tone', 'A semitone', 'A third', 'An octave'], 3,
        'An octave spans between one musical pitch and another with double or half its frequency, sharing the same note name.'],
      ['m', 'Which of the following are musical clefs? (Select all that apply)',
        ['Treble clef', 'Bass clef', 'Alto clef', 'Tenor clef', 'Volume clef'], [0, 1, 2, 3],
        'Treble, bass, alto, and tenor clefs are all real musical clefs. "Volume clef" does not exist.'],
      ['m', 'Which are standard dynamic markings in music? (Select all that apply)',
        ['Piano (p) – soft', 'Forte (f) – loud', 'Mezzo-forte (mf) – moderately loud', 'Allegro – fast', 'Pianissimo (pp) – very soft'], [0, 1, 2, 4],
        'Piano, forte, mezzo-forte, and pianissimo are dynamic markings. "Allegro" is a tempo marking, not a dynamic.'],
      ['m', 'Which of the following are types of musical intervals? (Select all that apply)',
        ['Unison', 'Third', 'Fifth', 'Octave', 'Tempo'], [0, 1, 2, 3],
        'Unison, third, fifth, and octave are intervals measuring distances between notes. "Tempo" refers to speed, not an interval.'],
      ['m', 'Which describe properties of a major chord? (Select all that apply)',
        ['Consists of a root, major third, and perfect fifth', 'Has a bright, happy sound', 'Can be played in any key', 'Always consists of exactly 4 notes'], [0, 1, 2],
        'A major chord has a root, major third, and perfect fifth; sounds bright; and can be in any key. A standard major chord (triad) has 3 notes, not 4.'],
    ],
  },
  {
    title: 'Rock Music History',
    slug: 'rock-music-history',
    description: 'Test your knowledge of rock music\'s evolution, legendary bands, and iconic songs',
    category: 'music', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-rock-music.jpg',
    imageKeyword: 'rock,music,guitar,concert,electric',
    questions: [
      ['s', 'Which band released the iconic song "Stairway to Heaven"?',
        ['The Rolling Stones', 'Deep Purple', 'Led Zeppelin', 'Black Sabbath'], 2,
        '"Stairway to Heaven" was released by Led Zeppelin on their 1971 album "Led Zeppelin IV."'],
      ['s', 'Who is known as the "King of Rock and Roll"?',
        ['Chuck Berry', 'Jerry Lee Lewis', 'Elvis Presley', 'Bill Haley'], 2,
        'Elvis Presley earned the title "King of Rock and Roll" for his immense influence in the 1950s.'],
      ['s', 'Which guitarist is renowned for the landmark song "Purple Haze"?',
        ['Eric Clapton', 'Jimmy Page', 'Jimi Hendrix', 'Carlos Santana'], 2,
        '"Purple Haze" is one of Jimi Hendrix\'s most famous songs, released in 1967.'],
      ['s', 'Which rock band featured Freddie Mercury as its lead vocalist?',
        ['Aerosmith', 'Queen', 'The Who', 'Journey'], 1,
        'Queen — featuring the legendary Freddie Mercury — is one of the greatest rock bands of all time.'],
      ['s', 'Which band is nicknamed the "Fab Four"?',
        ['The Rolling Stones', 'The Doors', 'The Beatles', 'The Who'], 2,
        '"The Fab Four" is the famous nickname for The Beatles — John, Paul, George, and Ringo.'],
      ['s', 'In what year did the "British Invasion" of rock music begin in the United States?',
        ['1960', '1962', '1964', '1966'], 2,
        'The British Invasion began in 1964 when The Beatles appeared on The Ed Sullivan Show.'],
      ['s', 'In which decade did rock and roll emerge as a distinct musical genre?',
        ['1930s', '1940s', '1950s', '1960s'], 2,
        'Rock and roll emerged in the United States in the late 1940s and early 1950s, blending blues, country, and R&B.'],
      ['m', 'Which are classic rock bands from the 1960s–1980s? (Select all that apply)',
        ['The Rolling Stones', 'Led Zeppelin', 'AC/DC', 'Pink Floyd', 'Coldplay'], [0, 1, 2, 3],
        'The Rolling Stones, Led Zeppelin, AC/DC, and Pink Floyd are classic rock icons. Coldplay is a post-Britpop band from 1996.'],
      ['m', 'Which of the following are subgenres of rock music? (Select all that apply)',
        ['Heavy metal', 'Punk rock', 'Alternative rock', 'Grunge', 'Jazz'], [0, 1, 2, 3],
        'Heavy metal, punk rock, alternative rock, and grunge are rock subgenres. Jazz is a separate, distinct genre.'],
      ['m', 'Which are widely considered among the greatest rock albums of all time? (Select all that apply)',
        ['Led Zeppelin IV (1971)', 'The Dark Side of the Moon – Pink Floyd (1973)', 'Abbey Road – The Beatles (1969)', 'Thriller – Michael Jackson (1982)'], [0, 1, 2],
        'Led Zeppelin IV, The Dark Side of the Moon, and Abbey Road are iconic rock albums. "Thriller" is a pop/R&B album.'],
    ],
  },
  {
    title: 'Classical Music Masters',
    slug: 'classical-music-masters',
    description: 'Test your knowledge of the greatest classical composers and their timeless masterworks',
    category: 'music', timeLimit: 12, difficulty: 3,
    imageFile: 'quiz-classical-music.jpg',
    imageKeyword: 'classical,music,composer,orchestra,piano',
    questions: [
      ['s', 'Who composed Symphony No. 9, which includes the famous "Ode to Joy"?',
        ['Wolfgang Amadeus Mozart', 'Johann Sebastian Bach', 'Ludwig van Beethoven', 'Franz Schubert'], 2,
        'Beethoven composed Symphony No. 9 in D minor (1824), featuring the iconic choral finale "Ode to Joy."'],
      ['s', 'Who composed "The Four Seasons," a celebrated set of violin concertos?',
        ['Johann Sebastian Bach', 'Antonio Vivaldi', 'George Frideric Handel', 'Claudio Monteverdi'], 1,
        '"The Four Seasons" was composed by Italian Baroque composer Antonio Vivaldi around 1720.'],
      ['s', 'What nationality was Wolfgang Amadeus Mozart?',
        ['German', 'Italian', 'Austrian', 'French'], 2,
        'Mozart was born in Salzburg, then part of the Holy Roman Empire (modern-day Austria), in 1756.'],
      ['s', 'Who composed the famous ballet "Swan Lake"?',
        ['Igor Stravinsky', 'Sergei Prokofiev', 'Frédéric Chopin', 'Pyotr Ilyich Tchaikovsky'], 3,
        'Swan Lake was composed by Tchaikovsky, with its premiere in 1877.'],
      ['s', 'Who composed the "Moonlight Sonata" (Piano Sonata No. 14)?',
        ['Frédéric Chopin', 'Franz Schubert', 'Ludwig van Beethoven', 'Robert Schumann'], 2,
        'The "Moonlight Sonata" was composed by Beethoven in 1801 and is one of his most beloved piano works.'],
      ['s', 'Who wrote the opera "The Marriage of Figaro" (Le Nozze di Figaro)?',
        ['Giuseppe Verdi', 'Richard Wagner', 'Wolfgang Amadeus Mozart', 'Giacomo Puccini'], 2,
        '"The Marriage of Figaro" (1786) is one of Mozart\'s masterpieces, with libretto by Lorenzo Da Ponte.'],
      ['m', 'Which are Baroque period composers? (Select all that apply)',
        ['Johann Sebastian Bach', 'George Frideric Handel', 'Antonio Vivaldi', 'Ludwig van Beethoven', 'Frédéric Chopin'], [0, 1, 2],
        'Bach, Handel, and Vivaldi were Baroque composers (c.1600–1750). Beethoven is Classical/Romantic; Chopin is Romantic.'],
      ['m', 'Which are Romantic period composers? (Select all that apply)',
        ['Frédéric Chopin', 'Franz Liszt', 'Johannes Brahms', 'Antonio Vivaldi', 'Johann Sebastian Bach'], [0, 1, 2],
        'Chopin, Liszt, and Brahms were Romantic composers (c.1820–1900). Vivaldi and Bach were Baroque.'],
      ['m', 'Which are forms of classical music composition? (Select all that apply)',
        ['Symphony', 'Sonata', 'Concerto', 'Fugue', 'Rap song'], [0, 1, 2, 3],
        'Symphonies, sonatas, concertos, and fugues are all classical music forms. Rap is a modern genre.'],
      ['m', 'Which statements about Beethoven are correct? (Select all that apply)',
        ['He was born in Bonn, Germany', 'He continued composing after becoming deaf', 'He composed 9 symphonies', 'He was a contemporary of Mozart'], [0, 1, 2, 3],
        'Beethoven was born in Bonn (1770), composed while deaf, wrote 9 symphonies, and overlapped with Mozart (though 14 years younger).'],
    ],
  },
  {
    title: 'Pop Music Icons',
    slug: 'pop-music-icons',
    description: 'How well do you know the legends of pop music? Test your knowledge of iconic artists',
    category: 'music', timeLimit: 10, difficulty: 1,
    imageFile: 'quiz-pop-music.jpg',
    imageKeyword: 'pop,music,concert,singer,performance',
    questions: [
      ['s', 'Which pop star is often referred to as the "Queen of Pop"?',
        ['Beyoncé', 'Whitney Houston', 'Madonna', 'Mariah Carey'], 2,
        'Madonna is widely known as the "Queen of Pop" due to her decades-long influence on popular music.'],
      ['s', 'Which artist released the iconic album "Thriller" in 1982?',
        ['Prince', 'Michael Jackson', 'Stevie Wonder', 'Diana Ross'], 1,
        '"Thriller" by Michael Jackson is the best-selling music album of all time, with over 70 million copies sold.'],
      ['s', 'Which artist is famous for the record-breaking "Eras Tour" concert series (2023–2024)?',
        ['Beyoncé', 'Adele', 'Taylor Swift', 'Billie Eilish'], 2,
        'Taylor Swift\'s "The Eras Tour" became the highest-grossing concert tour in history.'],
      ['s', 'Which pop group was Beyoncé originally a member of?',
        ['TLC', 'En Vogue', "Destiny's Child", 'Spice Girls'], 2,
        "Beyoncé rose to fame as the lead singer of Destiny's Child before her massively successful solo career."],
      ['s', 'What was the name of Lady Gaga\'s debut studio album (2008)?',
        ['The Fame Monster', 'Born This Way', 'The Fame', 'ARTPOP'], 2,
        '"The Fame" was Lady Gaga\'s 2008 debut album, featuring "Just Dance" and "Poker Face."'],
      ['s', 'Which nickname is commonly associated with pop icon Madonna?',
        ['Queen Bey', 'Mother Monster', 'Madge', 'MJ'], 2,
        'Madonna is frequently nicknamed "Madge," an informal shortening of her name.'],
      ['m', 'Which of the following are considered pop music icons? (Select all that apply)',
        ['Michael Jackson', 'Madonna', 'Whitney Houston', 'Britney Spears', 'Bob Dylan'], [0, 1, 2, 3],
        'Michael Jackson, Madonna, Whitney Houston, and Britney Spears are all major pop icons. Bob Dylan is primarily folk/rock.'],
      ['m', 'Which are hit songs by Taylor Swift? (Select all that apply)',
        ['Shake It Off', 'Blank Space', 'Bad Blood', 'Love Story', 'Bohemian Rhapsody'], [0, 1, 2, 3],
        '"Shake It Off," "Blank Space," "Bad Blood," and "Love Story" are Taylor Swift songs. "Bohemian Rhapsody" is by Queen.'],
      ['m', 'Which are achievements of Michael Jackson? (Select all that apply)',
        ['"Thriller" is the best-selling album of all time', 'He popularized the moonwalk dance move', 'He was in The Jackson 5 as a child', 'He founded Apple Records'], [0, 1, 2],
        'Michael Jackson holds the best-selling album record, popularized the moonwalk, and was in The Jackson 5. Apple Records was founded by The Beatles.'],
      ['m', 'Which pop artists have won the Grammy Album of the Year award multiple times? (Select all that apply)',
        ['Taylor Swift', 'Frank Sinatra', 'Adele', 'Beyoncé'], [0, 2],
        'Taylor Swift (4 wins) and Adele (2 wins) have each won Grammy Album of the Year multiple times.'],
    ],
  },

  // ========== HEALTH ==========
  {
    title: 'Human Anatomy',
    slug: 'human-anatomy',
    description: 'Test your knowledge of the human body — from bones to organs and major body systems',
    category: 'health', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-human-anatomy.jpg',
    imageKeyword: 'anatomy,human,body,health,medical',
    questions: [
      ['s', 'How many bones are in the adult human body?',
        ['178', '196', '206', '216'], 2,
        'The adult human body has 206 bones. Babies are born with ~270, which fuse as we grow.'],
      ['s', 'What is the largest organ of the human body?',
        ['Liver', 'Lungs', 'Brain', 'Skin'], 3,
        'The skin is the largest organ, covering an average surface area of about 2 square meters.'],
      ['s', 'Which organ produces insulin to regulate blood sugar levels?',
        ['Liver', 'Kidney', 'Pancreas', 'Spleen'], 2,
        'The pancreas produces insulin (and glucagon) to regulate blood glucose levels.'],
      ['s', 'What is the longest bone in the human body?',
        ['Tibia', 'Humerus', 'Spine (vertebral column)', 'Femur (thigh bone)'], 3,
        'The femur (thigh bone) is the longest and strongest bone in the human body.'],
      ['s', 'How many teeth does a healthy adult human have, including wisdom teeth?',
        ['28', '30', '32', '36'], 2,
        'Adults have 32 teeth — 28 regular teeth plus 4 wisdom teeth (third molars).'],
      ['s', 'What is the primary function of the cerebellum?',
        ['Controls speech and language', 'Regulates heart rate and breathing', 'Coordinates movement and balance', 'Processes visual information'], 2,
        'The cerebellum coordinates voluntary movements, balance, and fine motor skills.'],
      ['m', 'Which are the four chambers of the heart? (Select all that apply)',
        ['Left atrium', 'Right atrium', 'Left ventricle', 'Right ventricle', 'Central chamber'], [0, 1, 2, 3],
        'The heart has four chambers: left atrium, right atrium, left ventricle, and right ventricle. There is no "central chamber."'],
      ['m', 'Which organs are part of the digestive system? (Select all that apply)',
        ['Stomach', 'Small intestine', 'Large intestine', 'Liver', 'Lungs'], [0, 1, 2, 3],
        'The stomach, small and large intestines, and liver are digestive organs. The lungs are part of the respiratory system.'],
      ['m', 'Which are components of the human nervous system? (Select all that apply)',
        ['Brain', 'Spinal cord', 'Peripheral nerves', 'Blood vessels', 'Liver'], [0, 1, 2],
        'The nervous system includes the brain, spinal cord, and peripheral nerves. Blood vessels and the liver belong to other systems.'],
      ['m', 'Which are functions of the human skeletal system? (Select all that apply)',
        ['Provides structural support for the body', 'Protects internal organs', 'Produces blood cells in bone marrow', 'Pumps blood throughout the body'], [0, 1, 2],
        'The skeleton provides support, protects organs, and produces blood cells. Pumping blood is done by the heart.'],
    ],
  },
  {
    title: 'Nutrition & Healthy Eating',
    slug: 'nutrition-healthy-eating',
    description: 'Test your knowledge of nutrition science, healthy food choices, and dietary guidelines',
    category: 'health', timeLimit: 10, difficulty: 2,
    imageFile: 'quiz-nutrition.jpg',
    imageKeyword: 'nutrition,food,healthy,vegetables,diet',
    questions: [
      ['s', 'How many calories (kilocalories) are in one gram of protein?',
        ['2', '4', '7', '9'], 1,
        'Protein provides 4 kcal per gram. Carbohydrates also provide 4 kcal/g, while fats provide 9 kcal/g.'],
      ['s', 'Which vitamin is synthesized by the human body through sunlight exposure?',
        ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'], 3,
        'Vitamin D is produced in the skin when exposed to UVB sunlight.'],
      ['s', 'Which mineral is most essential for building and maintaining strong bones and teeth?',
        ['Iron', 'Sodium', 'Calcium', 'Potassium'], 2,
        'Calcium is the most abundant mineral in the body and critical for bone and tooth strength.'],
      ['s', 'What does the Glycemic Index (GI) measure?',
        ['The fat content of food', 'How quickly foods raise blood sugar levels', 'The protein content of food', 'The caloric density of food'], 1,
        'The Glycemic Index measures how rapidly carbohydrate-containing food raises blood glucose levels.'],
      ['s', 'Which vitamin is essential for vision, especially in low-light conditions?',
        ['Vitamin B6', 'Vitamin C', 'Vitamin A', 'Vitamin K'], 2,
        'Vitamin A is needed to produce rhodopsin, a light-sensitive pigment in the eye\'s rod cells.'],
      ['s', 'What is the general recommended daily water intake for adults?',
        ['500 ml (about 2 cups)', '1 liter (about 4 cups)', '2 liters (about 8 cups)', '4 liters (about 16 cups)'], 2,
        'Most health authorities recommend about 2 liters (8 cups) of water per day for adults.'],
      ['m', 'Which of the following are macronutrients? (Select all that apply)',
        ['Carbohydrates', 'Proteins', 'Fats', 'Vitamins', 'Minerals'], [0, 1, 2],
        'Macronutrients are carbohydrates, proteins, and fats. Vitamins and minerals are micronutrients, needed in smaller amounts.'],
      ['m', 'Which foods are good sources of omega-3 fatty acids? (Select all that apply)',
        ['Salmon', 'Walnuts', 'Flaxseeds', 'Chicken breast', 'White rice'], [0, 1, 2],
        'Salmon, walnuts, and flaxseeds are excellent omega-3 sources. Chicken breast and white rice are not significant sources.'],
      ['m', 'Which foods are high in dietary fiber? (Select all that apply)',
        ['Whole grains', 'Legumes (beans, lentils)', 'Vegetables', 'Fruits', 'Butter'], [0, 1, 2, 3],
        'Whole grains, legumes, vegetables, and fruits are all high in fiber. Butter is a fat with negligible fiber.'],
      ['m', 'Which statements about a balanced diet are correct? (Select all that apply)',
        ['It includes a variety of food groups', 'It limits excessive sugar and processed foods', 'It provides adequate vitamins and minerals', 'It means eating only plant-based foods'], [0, 1, 2],
        'A balanced diet includes variety, limits excess sugar, and provides essential nutrients. It does not necessarily mean only plant-based foods.'],
    ],
  },
  {
    title: 'Mental Health Awareness',
    slug: 'mental-health-awareness',
    description: 'Increase your understanding of mental health conditions, treatments, and well-being',
    category: 'health', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-mental-health.jpg',
    imageKeyword: 'mental,health,wellness,mind,psychology',
    questions: [
      ['s', 'What does CBT stand for in mental health treatment?',
        ['Clinical Brain Therapy', 'Cognitive Behavioral Therapy', 'Comprehensive Brain Treatment', 'Cognitive Balance Training'], 1,
        'Cognitive Behavioral Therapy (CBT) is one of the most evidence-based treatments for anxiety and depression.'],
      ['s', 'What does PTSD stand for?',
        ['Post-Traumatic Stress Disorder', 'Progressive Thought Stress Disease', 'Persistent Traumatic Social Disorder', 'Post-Tension Stress Dysfunction'], 0,
        'PTSD (Post-Traumatic Stress Disorder) can develop in people after experiencing or witnessing traumatic events.'],
      ['s', 'The DSM-5 (Diagnostic and Statistical Manual of Mental Disorders) is published by which organization?',
        ['World Health Organization (WHO)', 'American Psychological Association', 'American Psychiatric Association', 'National Institute of Mental Health'], 2,
        'The DSM-5 is published by the American Psychiatric Association and is the primary guide for diagnosing mental health disorders.'],
      ['s', 'What is the term for an intense fear of open spaces or situations where escape may be difficult?',
        ['Claustrophobia', 'Acrophobia', 'Agoraphobia', 'Arachnophobia'], 2,
        'Agoraphobia is an anxiety disorder involving fear of situations where panic may occur and escape is difficult.'],
      ['s', 'What therapy technique involves gradual, controlled exposure to feared stimuli to reduce anxiety?',
        ['Hypnotherapy', 'Exposure therapy', 'Psychoanalysis', 'Art therapy'], 1,
        'Exposure therapy is an evidence-based technique that helps individuals confront and reduce their fears gradually.'],
      ['s', 'What is the clinical term for persistent sadness and loss of interest lasting at least two weeks?',
        ['Bipolar disorder', 'Generalized Anxiety Disorder', 'Major Depressive Disorder', 'Seasonal Affective Disorder'], 2,
        'Major Depressive Disorder (MDD) is diagnosed when depressive symptoms persist for at least two weeks.'],
      ['m', 'Which of the following are classified as anxiety disorders? (Select all that apply)',
        ['Generalized Anxiety Disorder (GAD)', 'Panic Disorder', 'Social Anxiety Disorder', 'Schizophrenia', 'Bipolar Disorder'], [0, 1, 2],
        'GAD, Panic Disorder, and Social Anxiety Disorder are anxiety disorders. Schizophrenia is psychotic; Bipolar is a mood disorder.'],
      ['m', 'Which are healthy coping strategies for managing stress? (Select all that apply)',
        ['Regular physical exercise', 'Mindfulness meditation', 'Talking to a trusted person', 'Journaling', 'Excessive alcohol consumption'], [0, 1, 2, 3],
        'Exercise, mindfulness, social support, and journaling are healthy coping strategies. Excessive alcohol is harmful and counterproductive.'],
      ['m', 'Which are common symptoms of depression? (Select all that apply)',
        ['Persistent sadness or emptiness', 'Loss of interest in activities once enjoyed', 'Changes in sleep patterns', 'Persistent high energy', 'Fatigue and low energy'], [0, 1, 2, 4],
        'Persistent sadness, loss of interest, sleep changes, and fatigue are hallmark depression symptoms. Depression causes low, not high, energy.'],
      ['m', 'Which are evidence-based treatments for mental health disorders? (Select all that apply)',
        ['Cognitive Behavioral Therapy (CBT)', 'Medication (antidepressants, anxiolytics)', 'Mindfulness-Based Stress Reduction (MBSR)', 'Astrology readings'], [0, 1, 2],
        'CBT, medication, and MBSR are evidence-based treatments. Astrology readings are not a recognized medical treatment.'],
    ],
  },
  {
    title: 'Fitness & Exercise Science',
    slug: 'fitness-exercise-science',
    description: 'Test your knowledge of exercise science, fitness principles, and physical training methods',
    category: 'health', timeLimit: 10, difficulty: 2,
    imageFile: 'quiz-fitness-exercise.jpg',
    imageKeyword: 'fitness,exercise,gym,workout,training',
    questions: [
      ['s', 'What does BMI stand for?',
        ['Body Muscle Index', 'Basic Metabolic Indicator', 'Body Mass Index', 'Balanced Movement Index'], 2,
        'BMI (Body Mass Index) is a measure of body fat based on height and weight.'],
      ['s', 'How many minutes of moderate-intensity aerobic activity per week does the WHO recommend for adults?',
        ['75 minutes', '120 minutes', '150 minutes', '200 minutes'], 2,
        'The WHO recommends at least 150–300 minutes of moderate-intensity aerobic activity per week for adults.'],
      ['s', 'Which is the largest skeletal muscle in the human body?',
        ['Biceps brachii', 'Pectoralis major', 'Latissimus dorsi', 'Gluteus maximus'], 3,
        'The gluteus maximus (buttock muscle) is the largest skeletal muscle in the human body.'],
      ['s', 'Which type of exercise primarily improves cardiovascular (heart and lung) fitness?',
        ['Anaerobic exercise', 'Aerobic exercise', 'Strength training', 'Plyometrics'], 1,
        'Aerobic exercise (running, cycling, swimming) improves cardiovascular endurance.'],
      ['s', 'What does the "FITT" principle stand for in exercise programming?',
        ['Force, Intensity, Training, Timing', 'Frequency, Intensity, Time, Type', 'Fitness, Interval, Training, Timing', 'Frequency, Intensity, Technique, Training'], 1,
        'FITT stands for Frequency, Intensity, Time, and Type — a framework for designing effective exercise programs.'],
      ['s', 'What is the typical recommended rest time between sets during strength training?',
        ['10–30 seconds', '45–90 seconds', '1–3 minutes', '5–10 minutes'], 2,
        'For general strength training, 1–3 minutes of rest between sets allows adequate muscle recovery.'],
      ['m', 'Which are recognized components of physical fitness? (Select all that apply)',
        ['Cardiovascular endurance', 'Muscular strength', 'Flexibility', 'Body composition', 'Intelligence'], [0, 1, 2, 3],
        'The five main fitness components are cardiovascular endurance, muscular strength, muscular endurance, flexibility, and body composition. Intelligence is not a fitness component.'],
      ['m', 'Which are proven benefits of regular physical exercise? (Select all that apply)',
        ['Improved cardiovascular health', 'Better sleep quality', 'Reduced risk of depression', 'Stronger bones', 'Guaranteed weight loss regardless of diet'], [0, 1, 2, 3],
        'Exercise improves heart health, sleep, mental health, and bone density. While it aids weight management, results depend on overall diet and lifestyle.'],
      ['m', 'Which of the following are examples of anaerobic exercises? (Select all that apply)',
        ['Weightlifting', 'Sprinting (100m dash)', 'HIIT (High-Intensity Interval Training)', 'Light walking', 'Plyometrics'], [0, 1, 2, 4],
        'Weightlifting, sprinting, HIIT, and plyometrics are anaerobic (short, intense). Light walking is aerobic.'],
      ['m', 'Which statements about stretching are correct? (Select all that apply)',
        ['Static stretching improves long-term flexibility', 'Warming up before exercise reduces injury risk', 'Dynamic stretching is better before workouts than static', 'Proper stretching eliminates all risk of muscle injury'], [0, 1, 2],
        'Static stretching builds flexibility; warm-ups reduce injury risk; dynamic stretching is preferred pre-workout. No stretching eliminates ALL injury risk.'],
    ],
  },

  // ========== SPORTS ==========
  {
    title: 'Football (Soccer) Legends',
    slug: 'football-soccer-legends',
    description: 'Test your knowledge of football legends, World Cup history, and the beautiful game',
    category: 'sports', timeLimit: 10, difficulty: 2,
    imageFile: 'quiz-soccer-football.jpg',
    imageKeyword: 'soccer,football,sport,stadium,player',
    questions: [
      ['s', 'How many players does each team have on the field in association football (soccer)?',
        ['9', '10', '11', '12'], 2,
        'Each team has 11 players on the field, including one goalkeeper.'],
      ['s', 'Which country has won the most FIFA World Cup titles?',
        ['Germany', 'Italy', 'Argentina', 'Brazil'], 3,
        'Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).'],
      ['s', 'Who scored the famous "Goal of the Century" at the 1986 FIFA World Cup?',
        ['Pelé', 'Zinedine Zidane', 'Diego Maradona', 'Ronaldo'], 2,
        'Diego Maradona scored the "Goal of the Century" against England in the 1986 World Cup quarter-final.'],
      ['s', 'In which year was the first FIFA World Cup held?',
        ['1924', '1928', '1930', '1934'], 2,
        'The first FIFA World Cup was held in Uruguay in 1930, won by the host nation.'],
      ['s', 'What is a "hat-trick" in football?',
        ['Scoring two goals in a match', 'Scoring three goals in a single game', 'Scoring four goals in one match', 'Scoring with your head'], 1,
        'A hat-trick means one player scores three goals in a single match.'],
      ['s', 'With which club did Lionel Messi win most of his Ballon d\'Or awards?',
        ['Paris Saint-Germain', 'Inter Miami', 'Manchester City', 'FC Barcelona'], 3,
        'Messi won 7 of his 8 Ballon d\'Or awards while playing for FC Barcelona.'],
      ['s', 'What is the regulation playing time of a standard football match?',
        ['80 minutes', '90 minutes (plus added time)', '100 minutes', '120 minutes'], 1,
        'A standard match has two 45-minute halves (90 minutes), plus referee-added stoppage time.'],
      ['m', 'Which players are widely considered among the greatest footballers of all time? (Select all that apply)',
        ['Pelé', 'Diego Maradona', 'Lionel Messi', 'Cristiano Ronaldo', 'LeBron James'], [0, 1, 2, 3],
        'Pelé, Maradona, Messi, and Ronaldo are football legends. LeBron James is a basketball star.'],
      ['m', 'Which are positions in association football? (Select all that apply)',
        ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Pitcher'], [0, 1, 2, 3],
        'Goalkeeper, defender, midfielder, and forward are football positions. "Pitcher" is a baseball term.'],
      ['m', 'Which are major international football competitions? (Select all that apply)',
        ['FIFA World Cup', 'UEFA Champions League', 'Copa América', 'UEFA European Championship', 'NBA Finals'], [0, 1, 2, 3],
        'FIFA World Cup, Champions League, Copa América, and Euro are football competitions. The NBA Finals is basketball.'],
    ],
  },
  {
    title: 'Olympic Games History',
    slug: 'olympic-games-history',
    description: 'Test your knowledge of the Olympic Games — from ancient origins to modern-day glory',
    category: 'sports', timeLimit: 12, difficulty: 2,
    imageFile: 'quiz-olympic-games.jpg',
    imageKeyword: 'olympics,games,sport,medal,stadium',
    questions: [
      ['s', 'In which city were the first modern Olympic Games held?',
        ['Rome, Italy', 'Paris, France', 'London, England', 'Athens, Greece'], 3,
        'The first modern Olympic Games were held in Athens, Greece in 1896.'],
      ['s', 'How often are the Summer Olympic Games held?',
        ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'], 2,
        'The Summer Olympics are held every four years (the Olympiad cycle).'],
      ['s', 'How many rings are in the Olympic symbol?',
        ['4', '5', '6', '7'], 1,
        'The Olympic symbol consists of five interlocking colored rings.'],
      ['s', 'What do the five Olympic rings represent?',
        ['The five sports disciplines', 'The five founding nations', 'The five continents of the world', 'The five Olympic values'], 2,
        'The five rings represent the five continents: Africa, Americas, Asia, Europe, and Oceania.'],
      ['s', 'Which country has won the most Olympic gold medals in history?',
        ['Russia/USSR', 'China', 'Great Britain', 'United States'], 3,
        'The United States has won the most Olympic gold medals in history.'],
      ['s', 'What is the official Olympic motto?',
        ['"Play Fair, Win Together"', '"United by Sports"', '"Faster, Higher, Stronger"', '"Peace, Sport, Excellence"'], 2,
        'The Olympic motto is "Citius, Altius, Fortius" — Latin for "Faster, Higher, Stronger."'],
      ['s', 'Who famously lit the Olympic cauldron at the 1996 Atlanta Summer Olympics?',
        ['Carl Lewis', 'Michael Johnson', 'Muhammad Ali', 'Evander Holyfield'], 2,
        'Muhammad Ali, visibly affected by Parkinson\'s disease, lit the Olympic flame in Atlanta (1996).'],
      ['m', 'Which sports are contested at the Summer Olympics? (Select all that apply)',
        ['Swimming', 'Athletics (Track & Field)', 'Gymnastics', 'Alpine Skiing', 'Rowing'], [0, 1, 2, 4],
        'Swimming, athletics, gymnastics, and rowing are Summer Olympic sports. Alpine skiing is a Winter sport.'],
      ['m', 'Which countries have hosted the Summer Olympic Games more than once? (Select all that apply)',
        ['United States', 'Great Britain', 'France', 'Brazil', 'India'], [0, 1, 2],
        'USA (1904, 1932, 1984, 1996, 2028), UK (1908, 1948, 2012), and France (1900, 1924, 2024) hosted multiple Summer Olympics. Brazil hosted once (2016); India has not hosted.'],
      ['m', 'Which facts about the Olympic Games are correct? (Select all that apply)',
        ['The ancient Olympics were held in Olympia, Greece', 'The modern Olympics were revived in 1896', 'Athletes compete representing their countries', 'Only amateur athletes can compete in modern Olympics'], [0, 1, 2],
        'The ancient Olympics were in Olympia; modern Games began 1896; athletes represent their nations. Modern Olympics allow both amateurs and professionals.'],
    ],
  },
  {
    title: 'Basketball Fundamentals',
    slug: 'basketball-fundamentals',
    description: 'Test your knowledge of basketball rules, history, legendary players, and iconic teams',
    category: 'sports', timeLimit: 10, difficulty: 2,
    imageFile: 'quiz-basketball.jpg',
    imageKeyword: 'basketball,sport,nba,hoop,court',
    questions: [
      ['s', 'How many players are on the court per team in basketball at one time?',
        ['4', '5', '6', '7'], 1,
        'Each basketball team has 5 players on the court simultaneously.'],
      ['s', 'How high is a regulation basketball hoop from the floor?',
        ['8 feet (2.44m)', '9 feet (2.74m)', '10 feet (3.05m)', '11 feet (3.35m)'], 2,
        'A standard basketball hoop is 10 feet (3.05 meters) above the court floor.'],
      ['s', 'Which player is known by the nickname "Air Jordan" or "His Airness"?',
        ['Kobe Bryant', 'LeBron James', 'Magic Johnson', 'Michael Jordan'], 3,
        'Michael Jordan\'s extraordinary leaping ability earned him the nickname "Air Jordan."'],
      ['s', 'How many points is a successful three-point shot worth?',
        ['1', '2', '3', '4'], 2,
        'A shot made from behind the three-point arc is worth 3 points.'],
      ['s', 'How many quarters are played in an NBA game?',
        ['2', '3', '4', '5'], 2,
        'An NBA game consists of four quarters.'],
      ['s', 'How long is each quarter in a regulation NBA game?',
        ['8 minutes', '10 minutes', '12 minutes', '15 minutes'], 2,
        'Each NBA quarter is 12 minutes, for 48 total regulation minutes.'],
      ['s', 'Which NBA team has won the most championships (as of 2024)?',
        ['Los Angeles Lakers', 'Chicago Bulls', 'Golden State Warriors', 'Boston Celtics'], 3,
        'The Boston Celtics have won 18 NBA championships — the most in NBA history as of 2024.'],
      ['m', 'Which are standard positions in basketball? (Select all that apply)',
        ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Pitcher'], [0, 1, 2, 3],
        'The five basketball positions are Point Guard, Shooting Guard, Small Forward, Power Forward, and Center. "Pitcher" is a baseball term.'],
      ['m', 'Which of the following are violations in basketball? (Select all that apply)',
        ['Traveling (illegal foot movement)', 'Double dribbling', 'Goaltending', 'Shot clock violation', 'Offside'], [0, 1, 2, 3],
        'Traveling, double dribbling, goaltending, and shot clock violations are basketball violations. "Offside" is a rule in soccer/hockey, not basketball.'],
      ['m', 'Which NBA players have won multiple Most Valuable Player (MVP) awards? (Select all that apply)',
        ['Michael Jordan (5 MVPs)', 'LeBron James (4 MVPs)', 'Kareem Abdul-Jabbar (6 MVPs)', 'Shaquille O\'Neal'], [0, 1, 2],
        'Jordan (5), LeBron (4), and Kareem (6) are multiple MVP winners. Shaquille O\'Neal won 1 MVP.'],
    ],
  },
  {
    title: 'Tennis Champions',
    slug: 'tennis-champions',
    description: 'Test your knowledge of tennis rules, Grand Slams, and the sport\'s greatest champions',
    category: 'sports', timeLimit: 10, difficulty: 2,
    imageFile: 'quiz-tennis.jpg',
    imageKeyword: 'tennis,sport,court,player,racket',
    questions: [
      ['s', 'In men\'s Grand Slam finals (best of 5), how many sets must a player win?',
        ['2', '3', '4', '5'], 1,
        'Men\'s Grand Slam finals are best of 5 sets; a player wins by taking 3 sets.'],
      ['s', 'Which surface is used at Wimbledon?',
        ['Clay', 'Hard court', 'Grass', 'Carpet'], 2,
        'Wimbledon — the oldest Grand Slam — is played on natural grass courts.'],
      ['s', 'What does a score of "love" represent in tennis?',
        ['One point', 'Zero points', 'The advantage point', 'A tied game'], 1,
        'In tennis, "love" means zero (0 points). The term likely comes from the French "l\'oeuf" (the egg), symbolizing zero.'],
      ['s', 'What is the score called when both players are tied at 40-40 in tennis?',
        ['Tie', 'Advantage', 'Deuce', 'Set point'], 2,
        'When both players reach 40-40, it\'s called "deuce." A player must then win two consecutive points to win the game.'],
      ['s', 'Which player holds the record for the most men\'s Grand Slam singles titles (as of 2024)?',
        ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras'], 2,
        'Novak Djokovic holds the record with 24 Grand Slam singles titles as of 2024.'],
      ['s', 'Which female player has won the most Grand Slam singles titles in tennis history?',
        ['Martina Navratilova', 'Steffi Graf', 'Margaret Court', 'Serena Williams'], 2,
        'Margaret Court holds the all-time record with 24 Grand Slam titles. Serena Williams has 23.'],
      ['s', 'In what year did Serena Williams win her last Grand Slam singles title?',
        ['2015', '2016', '2017', '2019'], 2,
        'Serena Williams\' last Grand Slam was the 2017 Australian Open.'],
      ['m', 'Which are the four Grand Slam tennis tournaments? (Select all that apply)',
        ['Australian Open', 'French Open (Roland Garros)', 'Wimbledon', 'US Open', 'ATP Finals'], [0, 1, 2, 3],
        'The four Grand Slams are Australian Open, French Open, Wimbledon, and US Open. The ATP Finals is a year-end championship, not a Grand Slam.'],
      ['m', 'Which are official tennis scoring terms? (Select all that apply)',
        ['Love (0 points)', 'Deuce (40-40)', 'Advantage', 'Set point', 'Touchdown'], [0, 1, 2, 3],
        'Love, deuce, advantage, and set point are tennis terms. "Touchdown" is an American football term.'],
      ['m', 'Which court surfaces are used in Grand Slam tournaments? (Select all that apply)',
        ['Grass (Wimbledon)', 'Clay (French Open)', 'Hard court (US Open & Australian Open)', 'Carpet', 'Artificial turf'], [0, 1, 2],
        'Grand Slams are played on grass (Wimbledon), clay (French Open), and hard court (US Open and Australian Open). Carpet and artificial turf are not used in modern Grand Slams.'],
    ],
  },
];

// ==========================================================================
// UTILITIES
// ==========================================================================
function escSQL(str) {
  return str ? String(str).replace(/'/g, "''") : '';
}

function buildQuestionDB(quizId, idx, q) {
  const [type, text, opts, ans, explanation] = q;
  const questionType = type === 's' ? 'single_choice' : 'multiple_choice';
  const options = opts.map((o, i) => ({ id: `opt${i + 1}`, text: o }));

  let questionData, correctAnswer;
  if (type === 's') {
    questionData = { options };
    correctAnswer = { id: `opt${ans + 1}` };
  } else {
    questionData = { options, min_selections: 1, max_selections: opts.length, partial_credit: true };
    correctAnswer = ans.map(i => ({ id: `opt${i + 1}` }));
  }

  return {
    quiz_id: quizId,
    question_text: text,
    question_type: questionType,
    question_order: idx + 1,
    points: 1,
    explanation,
    question_data: questionData,
    correct_answer: correctAnswer,
  };
}

// ==========================================================================
// IMAGE DOWNLOAD
// ==========================================================================
function tryDownload(url, destPath, callback, redirectCount = 0) {
  if (redirectCount > 6) return callback(new Error('Too many redirects'));
  try {
    const parsedUrl = new URL(url);
    const mod = parsedUrl.protocol === 'https:' ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/jpeg,image/png,image/webp,image/*',
      },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return tryDownload(next, destPath, callback, redirectCount + 1);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return callback(new Error(`HTTP ${res.statusCode}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => { file.close(); callback(null); });
      file.on('error', (err) => { try { fs.unlinkSync(destPath); } catch (_) {} callback(err); });
    });
    req.on('timeout', () => { req.destroy(); callback(new Error('Timeout')); });
    req.on('error', callback);
  } catch (err) {
    callback(err);
  }
}

function downloadImage(primaryUrl, fallbackUrl, destPath) {
  return new Promise((resolve) => {
    tryDownload(primaryUrl, destPath, (err1) => {
      if (!err1) return resolve(true);
      console.log(`    ⚠ Primary failed (${err1.message?.slice(0, 50)}), trying fallback...`);
      tryDownload(fallbackUrl, destPath, (err2) => {
        if (!err2) return resolve(true);
        console.log(`    ✗ Fallback also failed: ${err2.message?.slice(0, 50)}`);
        resolve(false);
      });
    });
  });
}

// ==========================================================================
// SUPABASE INSERT
// ==========================================================================
async function insertViaSupabase(quizzesWithImages) {
  let createClient;
  try {
    ({ createClient } = require('@supabase/supabase-js'));
  } catch (e) {
    throw new Error('Cannot load @supabase/supabase-js');
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  let successCount = 0;
  let failCount = 0;

  for (const quiz of quizzesWithImages) {
    const quizRecord = {
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description,
      category_id: CATEGORY_IDS[quiz.category],
      time_limit: quiz.timeLimit,
      difficulty_level: quiz.difficulty,
      is_published: true,
      image_url: quiz.resolvedImageUrl,
    };

    const { data: inserted, error: quizErr } = await supabase
      .from('quizzes')
      .insert(quizRecord)
      .select('id')
      .single();

    if (quizErr) {
      if (quizErr.code === '23505') {
        console.log(`  ⏭ Quiz already exists (slug conflict): ${quiz.slug}`);
      } else {
        console.error(`  ✗ Quiz insert failed: ${quizErr.message}`);
        if (quizErr.message.includes('row-level security')) throw new Error('RLS_BLOCKED');
        failCount++;
      }
      continue;
    }

    const questions = quiz.questions.map((q, i) => buildQuestionDB(inserted.id, i, q));
    const { error: qErr } = await supabase.from('questions').insert(questions);

    if (qErr) {
      console.error(`  ✗ Questions insert failed: ${qErr.message}`);
      failCount++;
    } else {
      console.log(`  ✓ "${quiz.title}" — ${questions.length} questions`);
      successCount++;
    }
  }

  return { successCount, failCount };
}

// ==========================================================================
// SQL FILE GENERATION (fallback)
// ==========================================================================
function generateSQLFile(quizzesWithImages) {
  const lines = [
    '-- ============================================================',
    '-- Quiz Game Seed Data — Generated by seed-quizzes.js',
    `-- Generated: ${new Date().toISOString()}`,
    '-- Run this entire script in your Supabase SQL Editor',
    '-- ============================================================',
    '',
  ];

  // Insert quizzes
  lines.push('-- ===== QUIZZES =====');
  for (const quiz of quizzesWithImages) {
    const catId = CATEGORY_IDS[quiz.category];
    lines.push(`INSERT INTO quizzes (title, slug, description, category_id, time_limit, difficulty_level, is_published, image_url)`);
    lines.push(`VALUES (`);
    lines.push(`  '${escSQL(quiz.title)}',`);
    lines.push(`  '${escSQL(quiz.slug)}',`);
    lines.push(`  '${escSQL(quiz.description)}',`);
    lines.push(`  '${catId}',`);
    lines.push(`  ${quiz.timeLimit},`);
    lines.push(`  ${quiz.difficulty},`);
    lines.push(`  true,`);
    lines.push(`  '${escSQL(quiz.resolvedImageUrl)}'`);
    lines.push(`) ON CONFLICT (slug) DO NOTHING;`);
    lines.push('');
  }

  // Insert questions
  lines.push('-- ===== QUESTIONS =====');
  for (const quiz of quizzesWithImages) {
    lines.push(`-- Questions for: ${quiz.title}`);
    lines.push(`DO $$ BEGIN`);
    lines.push(`  IF NOT EXISTS (`);
    lines.push(`    SELECT 1 FROM questions q JOIN quizzes z ON q.quiz_id = z.id WHERE z.slug = '${escSQL(quiz.slug)}'`);
    lines.push(`  ) THEN`);

    for (let i = 0; i < quiz.questions.length; i++) {
      const built = buildQuestionDB('__PLACEHOLDER__', i, quiz.questions[i]);
      const qData = escSQL(JSON.stringify(built.question_data));
      const cAnswer = escSQL(JSON.stringify(built.correct_answer));
      const qText = escSQL(built.question_text);
      const exp = escSQL(built.explanation);

      lines.push(`    INSERT INTO questions (quiz_id, question_text, question_type, question_order, points, explanation, question_data, correct_answer)`);
      lines.push(`    SELECT id, '${qText}', '${built.question_type}', ${built.question_order}, 1, '${exp}', '${qData}'::jsonb, '${cAnswer}'::jsonb`);
      lines.push(`    FROM quizzes WHERE slug = '${escSQL(quiz.slug)}';`);
    }

    lines.push(`  END IF;`);
    lines.push(`END $$;`);
    lines.push('');
  }

  fs.writeFileSync(SQL_OUTPUT, lines.join('\n'), 'utf8');
  console.log(`\n✅ SQL file generated: ${SQL_OUTPUT}`);
  console.log('   Copy the contents of this file and run it in your Supabase SQL Editor.');
}

// ==========================================================================
// MAIN
// ==========================================================================
async function main() {
  console.log('🚀 Quiz Seed Script Starting...\n');
  console.log(`📁 Images directory: ${IMAGES_DIR}`);
  console.log(`🔑 Service role key: ${SERVICE_KEY ? '✓ Found' : '✗ Not found (will generate SQL)'}\n`);

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Step 1: Download images
  console.log('━'.repeat(60));
  console.log('📸 STEP 1: Downloading quiz images...\n');

  const quizzesWithImages = [];
  for (let i = 0; i < QUIZZES.length; i++) {
    const quiz = QUIZZES[i];
    const destPath = path.join(IMAGES_DIR, quiz.imageFile);
    let resolvedImageUrl;

    if (fs.existsSync(destPath)) {
      console.log(`  [${i + 1}/${QUIZZES.length}] ⏭ Already exists: ${quiz.imageFile}`);
      resolvedImageUrl = `/images/${quiz.imageFile}`;
    } else {
      console.log(`  [${i + 1}/${QUIZZES.length}] ⬇ Downloading: ${quiz.imageFile}`);
      const primaryUrl = `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(quiz.imageKeyword)}`;
      const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(quiz.slug)}/800/600`;

      const success = await downloadImage(primaryUrl, fallbackUrl, destPath);
      if (success) {
        resolvedImageUrl = `/images/${quiz.imageFile}`;
        console.log(`    ✓ Saved: ${quiz.imageFile}`);
      } else {
        resolvedImageUrl = `/images/bg-quiz-image.jpg`;
        console.log(`    ⚠ Using default image for: ${quiz.title}`);
      }
    }

    quizzesWithImages.push({ ...quiz, resolvedImageUrl });

    // Small delay between downloads to avoid rate limiting
    if (i < QUIZZES.length - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Step 2: Insert data into Supabase or generate SQL
  console.log('\n' + '━'.repeat(60));

  if (SERVICE_KEY && SUPABASE_URL) {
    console.log('🗄  STEP 2: Inserting data into Supabase...\n');
    try {
      const { successCount, failCount } = await insertViaSupabase(quizzesWithImages);
      console.log(`\n✅ Done! ${successCount} quizzes inserted, ${failCount} failed.`);
      if (failCount > 0) {
        console.log('   Also generating SQL file as backup...');
        generateSQLFile(quizzesWithImages);
      }
    } catch (err) {
      if (err.message === 'RLS_BLOCKED') {
        console.log('\n⚠  RLS policy blocked insertion. Generating SQL file instead...');
        generateSQLFile(quizzesWithImages);
      } else {
        console.error('Error:', err.message);
        generateSQLFile(quizzesWithImages);
      }
    }
  } else {
    console.log('📝 STEP 2: Generating SQL file (no service role key found)...\n');
    generateSQLFile(quizzesWithImages);
    console.log('\n💡 To insert directly, add to your .env.local:');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
    console.log('   (Find it in: Supabase Dashboard → Settings → API → service_role key)');
  }

  console.log('\n' + '━'.repeat(60));
  console.log('🎉 Seed script complete!');
  console.log(`   ${quizzesWithImages.length} quizzes prepared`);
  console.log(`   ${quizzesWithImages.length * 10} questions prepared`);
  console.log(`   Images saved to: public/images/`);
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message || err);
  process.exit(1);
});
