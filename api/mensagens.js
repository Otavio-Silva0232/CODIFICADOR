const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

module.exports = async function handler(req, res) {

    // ============================================
    // POST - SALVAR MENSAGEM
    // ============================================

    if (req.method === "POST") {

        try {

            const {
                remetente,
                destinatario,
                assunto,
                nomeArquivo,
                conteudo
            } = req.body;

            if (
                !remetente ||
                !destinatario ||
                !assunto ||
                !nomeArquivo ||
                !conteudo
            ) {

                return res.status(400).json({
                    sucesso: false,
                    erro: "Todos os campos são obrigatórios."
                });

            }

            // Verificar se remetente existe
            const remetenteExiste = await sql`
                SELECT usuario
                FROM usuarios
                WHERE usuario = ${remetente}
                LIMIT 1
            `;

            if (remetenteExiste.length === 0) {

                return res.status(400).json({
                    sucesso: false,
                    erro: "Remetente inválido."
                });

            }

            // Verificar se destinatário existe
            const destinatarioExiste = await sql`
                SELECT usuario
                FROM usuarios
                WHERE usuario = ${destinatario}
                LIMIT 1
            `;

            if (destinatarioExiste.length === 0) {

                return res.status(400).json({
                    sucesso: false,
                    erro: "Destinatário inválido."
                });

            }

            // Não permitir enviar para si mesmo
            if (remetente === destinatario) {

                return res.status(400).json({
                    sucesso: false,
                    erro: "Você não pode enviar uma mensagem para si mesmo."
                });

            }

            // Salvar mensagem
            const resultado = await sql`
                INSERT INTO mensagens
                (
                    remetente,
                    destinatario,
                    assunto,
                    nome_arquivo,
                    conteudo
                )
                VALUES
                (
                    ${remetente},
                    ${destinatario},
                    ${assunto},
                    ${nomeArquivo},
                    ${conteudo}
                )
                RETURNING
                    id,
                    remetente,
                    destinatario,
                    assunto,
                    nome_arquivo,
                    criado_em
            `;

            return res.status(201).json({
                sucesso: true,
                mensagem: resultado[0]
            });

        } catch (erro) {

            console.error("ERRO AO SALVAR MENSAGEM:", erro);

            return res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao salvar a mensagem."
            });

        }
    }


    // ============================================
    // GET - BUSCAR MENSAGENS DO USUÁRIO
    // ============================================

    if (req.method === "GET") {

        try {

            const usuario =
                req.query.usuario;

            if (!usuario) {

                return res.status(400).json({
                    sucesso: false,
                    erro: "Usuário não informado."
                });

            }

            const mensagens = await sql`
                SELECT
                    id,
                    remetente,
                    destinatario,
                    assunto,
                    nome_arquivo,
                    conteudo,
                    criado_em
                FROM mensagens
                WHERE destinatario = ${usuario}
                ORDER BY criado_em DESC
            `;

            return res.status(200).json({
                sucesso: true,
                mensagens: mensagens
            });

        } catch (erro) {

            console.error("ERRO AO BUSCAR MENSAGENS:", erro);

            return res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao buscar mensagens."
            });

        }
    }


    // ============================================
    // DELETE - APAGAR MENSAGEM RECEBIDA
    // ============================================

    if (req.method === "DELETE") {

        try {

            const {
                id,
                usuario
            } = req.body || {};

            if (!id || !usuario) {

                return res.status(400).json({
                    sucesso: false,
                    erro: "Mensagem ou usuário não informado."
                });

            }

            const resultado = await sql`
                DELETE FROM mensagens
                WHERE id = ${id}
                AND destinatario = ${usuario}
                RETURNING id
            `;

            if (resultado.length === 0) {

                return res.status(404).json({
                    sucesso: false,
                    erro: "Mensagem não encontrada."
                });

            }

            return res.status(200).json({
                sucesso: true
            });

        } catch (erro) {

            console.error("ERRO AO APAGAR MENSAGEM:", erro);

            return res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao apagar a mensagem."
            });

        }
    }


    // ============================================
    // MÉTODO NÃO PERMITIDO
    // ============================================

    return res.status(405).json({
        sucesso: false,
        erro: "Método não permitido."
    });

};