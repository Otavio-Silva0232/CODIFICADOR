const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

module.exports = async function handler(req, res) {

    // ============================================
    // SOMENTE POST
    // ============================================

    if (req.method !== "POST") {

        return res.status(405).json({
            sucesso: false,
            erro: "Método não permitido."
        });

    }

    try {

        // ============================================
        // DADOS DO LOGIN
        // ============================================

        const {
            usuario,
            senha
        } = req.body || {};


        // ============================================
        // VALIDAÇÃO
        // ============================================

        if (!usuario || !senha) {

            return res.status(400).json({
                sucesso: false,
                erro: "Usuário e senha são obrigatórios."
            });

        }


        // ============================================
        // CONSULTAR USUÁRIO NO BANCO
        // ============================================

        const resultado = await sql`

            SELECT
                id,
                usuario

            FROM usuarios

            WHERE usuario = ${usuario}
            AND senha = ${senha}

            LIMIT 1

        `;


        // ============================================
        // LOGIN INCORRETO
        // ============================================

        if (resultado.length === 0) {

            return res.status(401).json({
                sucesso: false,
                erro: "Usuário ou senha incorretos."
            });

        }


        // ============================================
        // LOGIN CORRETO
        // ============================================

        return res.status(200).json({

            sucesso: true,

            usuario:
                resultado[0].usuario

        });


    } catch (erro) {

        console.error(
            "ERRO NO LOGIN:",
            erro
        );

        return res.status(500).json({

            sucesso: false,

            erro:
                "Erro interno no login."

        });

    }

};