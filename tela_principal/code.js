// ============================================
// USUÁRIO LOGADO
// ============================================

const usuarioLogado =
    localStorage.getItem("usuarioLogado");

if (!usuarioLogado) {
    alert("Você precisa estar logado.");
    window.location.href = "index.html";
}

// ============================================
// MOSTRAR USUÁRIO
// ============================================
document.getElementById("usuario").textContent =
    "Usuário: " + usuarioLogado;

// ============================================
// PEGAR MENSAGENS
// ============================================
const mensagens =
    JSON.parse(
        localStorage.getItem("mensagens")
    ) || [];

// ============================================
// FILTRAR MENSAGENS
// ============================================
const mensagensRecebidas =
    mensagens.filter(
        mensagem =>
            mensagem.destinatario === usuarioLogado
    );

// ============================================
// ELEMENTO DA PÁGINA
// ============================================
const container =
    document.getElementById("mensagens");

// ============================================
// NENHUMA MENSAGEM
// ============================================
if (mensagensRecebidas.length === 0) {
    container.innerHTML =
        "<p>Nenhuma mensagem recebida.</p>";
}

// ============================================
// MOSTRAR MENSAGENS
// ============================================
mensagensRecebidas.forEach(mensagem => {
    const div =
        document.createElement("div");

    div.className = "mensagem";

    div.innerHTML = `
        <hr>
        <h4>${mensagem.assunto}</h4>

        <p>
            <strong>Remetente:</strong>
            ${mensagem.remetente}
        </p>

        <p>
            <strong>Destinatário:</strong>
            ${mensagem.destinatario}
        </p>

        <p>
            <strong>Arquivo:</strong>
            ${mensagem.nomeArquivo}
        </p>

        <button
            onclick="baixarMensagem(${mensagem.id})"
        >
            Baixar arquivo
        </button>

        <button
            onclick="abrirDecodificador(${mensagem.id})"
        >
            Decodificar
        </button>

    `;

    container.appendChild(div);

});

// ============================================
// BAIXAR ARQUIVO
// ============================================

function baixarMensagem(id) {
    const mensagens =
        JSON.parse(
            localStorage.getItem("mensagens")
        ) || [];

    const mensagem =
        mensagens.find(
            item => item.id === id
        );

    if (!mensagem) {
        alert("Mensagem não encontrada.");
        return;
    }

    // ========================================
    // VALIDAÇÃO DE DESTINATÁRIO
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
            [mensagem.conteudo],
            {
                type: "text/plain;charset=utf-8"
            }
        );

    const url =
        URL.createObjectURL(arquivo);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        mensagem.nomeArquivo;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

// ============================================
// ABRIR DECODIFICADOR
// ============================================

function abrirDecodificador(id) {

    const mensagens =
        JSON.parse(
            localStorage.getItem("mensagens")
        ) || [];

    const mensagem =
        mensagens.find(
            item => item.id === id
        );

    if (!mensagem) {
        alert("Mensagem não encontrada.");
        return;

    }

    // ========================================
    // VALIDAÇÃO
    // ========================================
    if (
        mensagem.destinatario !==
        usuarioLogado
    ) {

        alert(
            "Você não tem permissão para decodificar esta mensagem."
        );
        return;
    }

    // Guardar ID temporariamente

    localStorage.setItem(
        "mensagemParaDecodificar",
        id
    );

    window.location.href =
        "/decodificar/decodificar.html";

}