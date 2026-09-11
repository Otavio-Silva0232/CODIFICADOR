// ============================================
// USUÁRIO LOGADO
// ============================================

const usuarioLogado =
    localStorage.getItem("usuarioLogado");


if (!usuarioLogado) {

    alert(
        "Você precisa estar logado."
    );

    window.location.href =
        "/index.html";

}


// ============================================
// MOSTRAR USUÁRIO
// ============================================

document
    .getElementById("usuario")
    .textContent =
        "Usuário: " + usuarioLogado;


// ============================================
// ELEMENTO DA PÁGINA
// ============================================

const container =
    document.getElementById("mensagens");


// ============================================
// CARREGAR MENSAGENS
// ============================================

async function carregarMensagens() {

    try {

        container.innerHTML =
            "<p>Carregando mensagens...</p>";


        const resposta =
            await fetch(
                "/api/mensagens?usuario=" +
                encodeURIComponent(usuarioLogado)
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            container.innerHTML =
                "<p>Erro ao carregar mensagens.</p>";

            console.error(
                resultado.erro
            );

            return;

        }


        const mensagens =
            resultado.mensagens || [];


        container.innerHTML = "";


        // ========================================
        // NENHUMA MENSAGEM
        // ========================================

        if (mensagens.length === 0) {

            container.innerHTML =
                "<p>Nenhuma mensagem recebida.</p>";

            return;

        }


        // ========================================
        // MOSTRAR MENSAGENS
        // ========================================

        mensagens.forEach(
            mensagem => {

                const div =
                    document.createElement("div");


                div.className =
                    "mensagem";


                div.innerHTML = `

                    <hr>

                    <h4>
                        ${escaparHTML(
                            mensagem.assunto
                        )}
                    </h4>

                    <p>
                        <strong>Remetente:</strong>
                        ${escaparHTML(
                            mensagem.remetente
                        )}
                    </p>

                    <p>
                        <strong>Destinatário:</strong>
                        ${escaparHTML(
                            mensagem.destinatario
                        )}
                    </p>

                    <p>
                        <strong>Arquivo:</strong>
                        ${escaparHTML(
                            mensagem.nome_arquivo
                        )}
                    </p>

                    <button
                        onclick="baixarMensagem(${mensagem.id})"
                    >
                        Baixar arquivo
                    </button>

                    <button
                        onclick="apagarMensagem(${mensagem.id})"
                    >
                        Apagar mensagem
                    </button>

                `;


                container.appendChild(div);

            }
        );


    } catch (erro) {

        console.error(
            "Erro:",
            erro
        );

        container.innerHTML =
            "<p>Não foi possível conectar ao servidor.</p>";

    }

}


// ============================================
// ESCAPAR HTML
// ============================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto;

    return div.innerHTML;

}


// ============================================
// BUSCAR UMA MENSAGEM
// ============================================

async function buscarMensagem(id) {

    try {

        const resposta =
            await fetch(
                "/api/mensagens?usuario=" +
                encodeURIComponent(usuarioLogado)
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            return null;

        }


        const mensagem =
            resultado.mensagens.find(
                item =>
                    Number(item.id) === Number(id)
            );


        return mensagem || null;


    } catch (erro) {

        console.error(erro);

        return null;

    }

}


// ============================================
// BAIXAR ARQUIVO
// ============================================

async function baixarMensagem(id) {

    const mensagem =
        await buscarMensagem(id);


    if (!mensagem) {

        alert(
            "Mensagem não encontrada."
        );

        return;

    }


    // ========================================
    // SEGURANÇA
    // ========================================

    if (
        mensagem.destinatario !==
        usuarioLogado
    ) {

        alert(
            "Você não tem permissão para baixar esta mensagem."
        );

        return;

    }


    // ========================================
    // CRIAR ARQUIVO
    // ========================================

    const arquivo =
        new Blob(
            [
                mensagem.conteudo
            ],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            arquivo
        );


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        mensagem.nome_arquivo;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


// ============================================
// APAGAR MENSAGEM
// ============================================

async function apagarMensagem(id) {

    if (!confirm("Tem certeza que deseja apagar esta mensagem?")) {

        return;

    }

    try {

        const resposta = await fetch("/api/mensagens", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                usuario: usuarioLogado
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {

            alert(resultado.erro || "Não foi possível apagar a mensagem.");

            return;

        }

        carregarMensagens();

    } catch (erro) {

        console.error("Erro ao apagar mensagem:", erro);
        alert("Não foi possível conectar ao servidor.");

    }

}


// ============================================
// INICIAR
// ============================================

carregarMensagens();