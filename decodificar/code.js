// ============================================
// CLASSE NO
// ============================================
class No {
    constructor(valor) {
        this.valor = valor;
        this.esquerda = null;
        this.direita = null;
    }
}

// ============================================
// CLASSE ARVORE
// ============================================

class Arvore {

    constructor() {

        this.raiz = null;

    }

    // ========================================
    // CARREGAR ÁRVORE
    // ========================================

    carregar(linhas) {

        let posicao = linhas.length - 1;

        function montar() {

            if (posicao < 0) {

                return null;

            }

            const valor = linhas[posicao];

            posicao--;

            // # representa nó vazio

            if (valor === "#") {

                return null;

            }

            const numero = Number(valor);

            if (Number.isNaN(numero)) {

                throw new Error(
                    "A árvore do arquivo é inválida."
                );

            }

            const no = new No(numero);

            no.direita = montar();

            no.esquerda = montar();

            return no;

        }

        this.raiz = montar();

    }

    // ========================================
    // ENCONTRAR CARACTERE
    // ========================================

    encontrar(codigo) {

        let no = this.raiz;

        if (!no) {

            return null;

        }

        // ====================================
        // RAIZ
        // ====================================

        if (codigo === "R") {

            return no.valor;

        }

        // ====================================
        // PERCORRER CAMINHO
        // ====================================

        for (const bit of codigo) {

            if (bit === "0") {

                no = no.esquerda;

            }

            else if (bit === "1") {

                no = no.direita;

            }

            else {

                return null;

            }

            // Caminho não existe

            if (!no) {

                return null;

            }

        }

        return no.valor;

    }

}

// ============================================
// VERIFICAR LOGIN
// ============================================

const usuarioLogado =
    localStorage.getItem("usuarioLogado");

if (!usuarioLogado) {

    alert(
        "Você precisa estar logado."
    );

    window.location.href =
        "index.html";

}

// ============================================
// MOSTRAR USUÁRIO
// ============================================

document.getElementById(
    "usuario"
).textContent =
    "Usuário: " + usuarioLogado;

// ============================================
// BOTÃO DECODIFICAR
// ============================================

document
    .getElementById("decodificar")
    .addEventListener(
        "click",
        iniciarDecodificacao
    );

// ============================================
// INICIAR DECODIFICAÇÃO
// ============================================

function iniciarDecodificacao() {

    // ========================================
    // PEGAR ARQUIVO
    // ========================================

    const input =
        document.getElementById("arquivo");

    const arquivo =
        input.files[0];

    if (!arquivo) {

        alert(
            "Selecione um arquivo."
        );

        return;

    }

    // ========================================
    // LER ARQUIVO
    // ========================================

    const leitor =
        new FileReader();

    leitor.onload =
        function(event) {

            const conteudoArquivo =
                event.target.result;

            decodificarArquivo(
                conteudoArquivo
            );

        };

    leitor.onerror =
        function() {

            mostrarErro(
                "Não foi possível ler o arquivo."
            );

        };

    leitor.readAsText(
        arquivo
    );

}

// ============================================
// PROCURAR MENSAGEM
// ============================================

// ============================================
// DECODIFICAR ARQUIVO
// ============================================

function decodificarArquivo(
    conteudo
) {

    try {

        // ====================================
        // SEPARAR LINHAS
        // ====================================

        const linhas =
            conteudo.split(/\r?\n/);

        if (
            linhas.length < 2
        ) {

            throw new Error(
                "O arquivo não possui uma estrutura válida."
            );

        }

        // ====================================
        // PRIMEIRA LINHA
        // CÓDIGO
        // ====================================

        const codigo =
            linhas[0];

        if (!codigo) {

            throw new Error(
                "O código da mensagem está vazio."
            );

        }

        // ====================================
        // RESTANTE
        // ÁRVORE
        // ====================================

        const linhasArvore =
            linhas.slice(1);

        // ====================================
        // CRIAR ÁRVORE
        // ====================================

        const arvore =
            new Arvore();

        arvore.carregar(
            linhasArvore
        );

        if (!arvore.raiz) {

            throw new Error(
                "Não foi possível reconstruir a árvore."
            );

        }

        // ====================================
        // DECODIFICAR
        // ====================================

        let mensagem = "";

        const caminhos =
            codigo.split("|");

        for (
            const caminho of caminhos
        ) {

            const numero =
                arvore.encontrar(
                    caminho
                );

            if (
                numero === null
            ) {

                throw new Error(
                    "Foi encontrado um caminho inválido na árvore."
                );

            }

            mensagem +=
                String.fromCharCode(
                    numero
                );

        }

        // ====================================
        // MOSTRAR RESULTADO
        // ====================================

        mostrarMensagem(
            mensagem
        );

    }

    catch (erro) {

        mostrarErro(
            erro.message
        );

    }

}

// ============================================
// MOSTRAR MENSAGEM
// ============================================

function mostrarMensagem(
    mensagem
) {

    const resultado =
        document.getElementById(
            "resultado"
        );

    resultado.innerHTML = "";

    // ========================================
    // TÍTULO
    // ========================================

    const titulo =
        document.createElement("h2");

    titulo.textContent =
        "Mensagem Descriptografada";

    // ========================================
    // TÍTULO DA MENSAGEM
    // ========================================

    const tituloMensagem =
        document.createElement("p");

    tituloMensagem.innerHTML =
        "<strong>Mensagem:</strong>";

    // ========================================
    // TEXTO
    // ========================================

    const textoMensagem =
        document.createElement("div");

    textoMensagem.className =
        "mensagem-decodificada";

    textoMensagem.textContent =mensagem;

    // ========================================
    // ADICIONAR NA PÁGINA
    // ========================================
    resultado.appendChild(titulo);

    resultado.appendChild(tituloMensagem);

    resultado.appendChild(textoMensagem);

    // ========================================
    // LIMPAR ID ANTIGO
    // ========================================
    localStorage.removeItem(
        "mensagemParaDecodificar"
    );

}

// ============================================
// MOSTRAR ERRO
// ============================================
function mostrarErro(mensagem) {
    const resultado =
        document.getElementById(
            "resultado"
        );

    resultado.innerHTML = "";

    const erro =
        document.createElement("p");

    erro.innerHTML =
        "<strong>Erro:</strong> ";

    erro.appendChild(
        document.createTextNode(
            mensagem
        )
    );

    resultado.appendChild(
        erro
    );

}