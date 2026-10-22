import express from 'express';
import dotenv from 'dotenv';
import conectarBanco from './db.js';

//recuperar as variáveis de ambiente do arquivo .env
dotenv.config();
// criar o servidor
const app = express();
// permitir json no corpo da requisição
app.use(express.json());
// definir a pasta de arquivos estáticos (frontend)
app.use(express.static('./public'));
// define a porta do servidor
const PORT = process.env.PORT;
// variável de conexão
const conn = conectarBanco();

// página inicial no frontend
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "./public" })
});

// rota para listar todos os livros
app.get('/livros', async (req, res) => {
    const sql = 'SELECT * FROM livros'
    const [resp] = await conn.query(sql);
    res.status(200).json(resp);
});

// rota para listar um único livro pelo id
app.get('/livros/:id', async (req, res) => {
    const id = Number(req.id);
    const sql = 'SELECT * FROM livros WHERE id = ?'
    const [resp] = await conn.query(sql, [id]);
    res.status(200).json(resp);
});

// rota para cadastrar um novo livro
app.post('/livros', async (req, res) => {
    const { titulo, descricao, autor } = req.body;

    if (!titulo || !descricao || !autor) {
        return res.status(400).json({
            erro: "É necessário informar título, descrição e autor da obra!"
        });
    }


    const sql = 'INSERT INTO livros (titulo, descricao, autor) VALUES (?, ?, ?)'
    const [resp] = await conn.query(sql, [titulo, descricao, autor], (erro) => {
        if (erro) {
            return res.status(500).json({ erro: "Erro interno ao cadastrar livro!" });
        }
    });
    res.status(201).json({
        mensagem: "Livro cadastrado com sucesso!",
        id: resp.insertId
    });
});

// rota para atualizar as informações de um livro

app.put('/livros/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descricao, autor } = req.body;
    if (!titulo || !descricao || !autor) {
        return res.status(400).json({ erro: "É necessário informar título, descrição e o autor." })
    }

    const sql  = 'UPDATE livros SET titulo = ?, descricao = ?, autor = ? WHERE id = ?';

    const [resp] = await conn.query(sql, [titulo, descricao, autor, id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({
                mensagem: "Erro interno ao atualizar livro!"
            });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: "Livro não encontrado ou inexistente"
            });
        }
    });

    res.status(201).json({
        mensagem: "Livro atualizado com sucesso!"
    });
});

// rota para excluir um livro da DB
app.delete('/livros/:id', async (req, res) => {
    const id = Number(req.params.id);
    if(!id){
        return res.status(400).json({erro: "É necessário informar o ID nos parâmetros!"})
    }
    const sql = 'DELETE FROM livros WHERE id = ?'

    const [resp] = await conn.query(sql, [id], (erro) => {
        if(erro) {
            return res.status(500).json({erro: "Erro interno ao excluir livro!"})
        }
        if(resp.affectedRows === 0) {
            return res.status(404).json({erro: "Livro não encontrado ou inexistente!"});
        }
    });
    res.status(201).json({
        mensagem: "Livro excluído com sucesso!"
    });
});

//======================================================
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})