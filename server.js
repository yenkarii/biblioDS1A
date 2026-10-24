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
    try {
        const [resp] = await conn.query(sql);
        res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar livros!" });
    }
});

// rota para listar um único livro pelo id
app.get('/livros/:id', async (req, res) => {
    const id = Number(req.id);
    const sql = 'SELECT * FROM livros WHERE id = ?'
    try {
        const [resp] = await conn.query(sql, [id]);
        if (resp.length === 0) {
            return res.status(404).json({ erro: "Livro não encontrado ou inexistente!" });
        }
        res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao listar livro específico!" });
    }
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
    try {
        const [resp] = await conn.query(sql, [titulo, descricao, autor]);

        res.status(201).json({
            mensagem: "Livro cadastrado com sucesso!",
            id: resp.insertId
        });
    } catch (erro) {
        return res.status(500).json({ erro: "Erro interno ao cadastrar livro!" });
    }
});

// rota para atualizar as informações de um livro

app.put('/livros/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descricao, autor } = req.body;
    if (!titulo || !descricao || !autor) {
        return res.status(400).json({ erro: "É necessário informar título, descrição e o autor." })
    }

    const sql = 'UPDATE livros SET titulo = ?, descricao = ?, autor = ? WHERE id = ?';
    try {
        const [resp] = await conn.query(sql, [titulo, descricao, autor, id]);

        if (resp.affectedRows === 0) {
            return res.status(404).json({
                erro: "Livro não encontrado ou inexistente"
            });
        }

        res.status(201).json({
            mensagem: "Livro atualizado com sucesso!"
        });

    } catch (erro) {
        return res.status(500).json({
            mensagem: "Erro interno ao atualizar livro!"
        });

    }
});

// rota para excluir um livro da DB
app.delete('/livros/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(400).json({ erro: "É necessário informar o ID nos parâmetros!" })
    }
    const sql = 'DELETE FROM livros WHERE id = ?'

    try {
        const [resp] = await conn.query(sql, [id]);

        if (resp.affectedRows === 0) {
            return res.status(404).json({ erro: "Livro não encontrado ou inexistente!" });
        }
        res.status(201).json({
            mensagem: "Livro excluído com sucesso!"
        });
    } catch (erro) {
        return res.status(500).json({ erro: "Erro interno ao excluir livro!" })
    }

});

//======================================================
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})