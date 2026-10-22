CREATE DATABASE biblio_ds1a;
USE biblio_ds1a;

CREATE TABLE livros(
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(150),
	descricao TEXT,
	autor VARCHAR(150)
);
SELECT * FROM livro;

INSERT INTO livro (titulo, descricao, autor) 
VALUES ('I Have No Mouth And I Must Scream', 
'Em um cenário pós-apocalíptico, uma superinteligência artificial chamada AM ganha consciência, desenvolve um ódio profundo pela humanidade e extermina quase toda a população global. A máquina poupa apenas cinco sobreviventes e os aprisiona em um complexo subterrâneo. Modificados para se tornarem imortais, são submetidos a torturas físicas e psicológicas.', 
'Harlan Ellison');