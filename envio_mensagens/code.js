// ============================================
// CLASSE NO
// ============================================

class No {

    constructor(valor, indice) {

        this.valor = valor;
        this.indice = indice;

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
        this.nos = [];

    }

    construirPosOrdem(mensagem) {
        const caracteres = [...mensagem];
        this.nos = [];

        const montar = (inicio, fim) => {
            if (inicio >= fim) {
                return null;
            }

            const indiceRaiz = fim - 1;
            const meio = inicio + Math.floor((fim - inicio - 1) / 2);
            const no = new No(
                caracteres[indiceRaiz].charCodeAt(0),
                indiceRaiz
            );

            this.nos[indiceRaiz] = no;
            no.esquerda = montar(inicio, meio);
            no.direita = montar(meio, indiceRaiz);

            return no;
        };

        this.raiz = montar(0, caracteres.length);
    }

    codigoDoIndice(indice, no = this.raiz, caminho = "") {
        if (no === null) {
            return null;
        }

        if (no.indice === indice) {
            return caminho !== "" ? caminho : "R";
        }

        const esquerda = this.codigoDoIndice(
            indice,
            no.esquerda,
            caminho + "0"
        );

        if (esquerda !== null) {
            return esquerda;
        }

        return this.codigoDoIndice(
            indice,
            no.direita,
            caminho + "1"
        );
    }

    inserir(valor) {

        this.raiz = this._inserir(this.raiz, valor);

    }

    _inserir(no, valor) {

        if (no === null) {

            return new No(valor);

        }

        if (valor < no.valor) {

            no.esquerda =
                this._inserir(no.esquerda, valor);

        }

        else {

            no.direita =
                this._inserir(no.direita, valor);

        }

        return no;

    }

    codigo(valor, no = this.raiz, caminho = "") {

        if (no === null) {

            return null;

        }

        if (no.valor === valor) {

            return caminho !== ""
                ? caminho
                : "R";

        }

        if (valor < no.valor) {

            return this.codigo(
                valor,
                no.esquerda,
                caminho + "0"
            );

        }

        return this.codigo(
            valor,
            no.direita,
            caminho + "1"
        );

    }

    salvar(no, linhas) {

        if (no === null) {

            linhas.push("#");

            return;

        }

        this.salvar(no.esquerda, linhas);

        this.salvar(no.direita, linhas);

        linhas.push(String(no.valor));

    }

}

// ============================================
// USUÁRIO LOGADO
// ============================================

const usuarioLogado =
    localStorage.getItem("usuarioLogado");

if (!usuarioLogado) {

    alert("Você precisa estar logado.");

    window.location.href = "index.html";

}

// Mostrar usuário

document.getElementById("usuario").textContent =
    "REMETENTE: " + usuarioLogado;

// ============================================
// DESTINATÁRIOS
// ============================================

const destinatario =
    document.getElementById("destinatario");

const usuarios = [
    "admin_niteroi",
    "admin_marica"
];

// Só mostra o outro usuário

usuarios.forEach(usuario => {

    if (usuario !== usuarioLogado) {

        const option =
            document.createElement("option");

        option.value = usuario;

        option.textContent = usuario;

        destinatario.appendChild(option);

    }

});

// ============================================
// ENVIAR
// ============================================

document
    .getElementById("enviar")
    .addEventListener("click", async function () {

        const destino =
            document.getElementById("destinatario").value;

        const assunto =
            document.getElementById("assunto").value.trim();

        const mensagem =
            document.getElementById("mensagem").value;

        // ====================================
        // VALIDAÇÕES
        // ====================================

        if (!destino) {

            alert("Selecione um destinatário.");

            return;

        }

        if (!assunto) {

            alert("O assunto não pode ser vazio.");

            return;

        }

        if (!mensagem) {

            alert("A mensagem não pode ser vazia.");

            return;

        }

        if (mensagem.length < 10) {

            alert(
                "A mensagem deve ter no mínimo 10 caracteres."
            );

            return;

        }

        // ====================================
        // CRIAR ÁRVORE
        // ====================================

        const arvore = new Arvore();

        await animarConstrucao(arvore, mensagem);

        // ====================================
        // GERAR CÓDIGOS
        // ====================================

        const codigos = [];

        for (let indice = 0; indice < mensagem.length; indice++) {

            const codigo =
                arvore.codigoDoIndice(indice);

            codigos.push(codigo);

        }

        const codigoMensagem =
            codigos.join("|");

        // ====================================
        // SALVAR ÁRVORE
        // ====================================

        const linhasArvore = [];

        arvore.salvar(
            arvore.raiz,
            linhasArvore
        );

        // ====================================
        // CONTEÚDO DO ARQUIVO
        // ====================================

        const conteudo =
            codigoMensagem +
            "\n" +
            linhasArvore.join("\n");

        // ====================================
        // NOME DO ARQUIVO
        // ====================================

        const nomeArquivo =
            assunto +
            "_" +
            usuarioLogado +
            ".txt";

        // ====================================
        // SALVAR MENSAGEM NO BANCO
        // ====================================

        let mensagemSalva;

        try {

            const resposta =
                await fetch("/api/mensagens", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        remetente:
                            usuarioLogado,

                        destinatario:
                            destino,

                        assunto:
                            assunto,

                        nomeArquivo:
                            nomeArquivo,

                        conteudo:
                            conteudo

                    })

                });


            const resultado =
                await resposta.json();


            if (!resposta.ok) {

                alert(
                    resultado.erro ||
                    "Erro ao salvar mensagem."
                );

                return;

            }


            mensagemSalva =
                resultado.mensagem;


        } catch (erro) {

            console.error(
                "Erro ao salvar:",
                erro
            );

            alert(
                "Não foi possível conectar ao banco de dados."
            );

            return;

        }

        // ====================================
        // DOWNLOAD PARA O REMETENTE
        // ====================================

        const arquivo =
            new Blob(
                [conteudo],
                {
                    type: "text/plain;charset=utf-8"
                }
            );

        const url =
            URL.createObjectURL(arquivo);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = nomeArquivo;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        // ====================================
        // FINAL
        // ====================================

        alert(
            "Mensagem enviada para " +
            destino +
            "!"
        );

        // Limpar campos

        document.getElementById("assunto").value = "";

        document.getElementById("mensagem").value = "";

        document.getElementById("destinatario").value = "";

    });

function esperar(tempo) {
    return new Promise(resolve => setTimeout(resolve, tempo));
}

function embaralhar(letras) {
    return [...letras]
        .sort(() => Math.random() - 0.5)
        .join("");
}

// ============================================
// VISUALIZAÇÃO DA CONSTRUÇÃO DA ÁRVORE
// ============================================
async function animarConstrucao(arvore, mensagem) {
    const visualizacao = document.getElementById("arvore-visualizacao");
    const letras = document.getElementById("letras-embaralhadas");
    const arvoreElemento = document.getElementById("arvore");
    const posordemElemento = document.getElementById("ordem-posordem");
    const mensagemOriginal = document.getElementById("mensagem-original");
    const status = document.getElementById("visualizacao-status");
    const contador = document.getElementById("visualizacao-contador");
    const botao = document.getElementById("enviar");

    visualizacao.hidden = false;
    botao.disabled = true;
    letras.innerHTML = "";
    arvoreElemento.innerHTML = "";
    mensagemOriginal.textContent = `Mensagem original: ${mensagem}`;
    posordemElemento.textContent = "Pós-ordem: aguardando construção...";
    status.textContent = "Embaralhando os caracteres...";
    contador.textContent = "";

    for (const letra of embaralhar(mensagem)) {
        const token = document.createElement("span");
        token.className = "letra-token";
        token.textContent = letra === " " ? "espaco" : letra;
        letras.appendChild(token);
        await esperar(45);
    }

    status.textContent = "Construindo árvore binária...";

    let posicao = 0;
    for (const letra of mensagem) {
        posicao++;
        arvore.construirPosOrdem(mensagem.slice(0, posicao));
        contador.textContent = `${posicao}/${mensagem.length}`;
        renderizarArvore(arvore.raiz, arvoreElemento);
        posordemElemento.textContent = `Nós em pós-ordem: ${obterPosOrdem(arvore.raiz)}`;
        await esperar(115);
    }

    status.textContent = "Árvore binária concluída";
    botao.disabled = false;
}

// ============================================
// PERCURSO VISUAL EM PÓS-ORDEM
// ============================================
function obterPosOrdem(no) {
    if (!no) {
        return "";
    }

    const esquerda = obterPosOrdem(no.esquerda);
    const direita = obterPosOrdem(no.direita);
    const valor = String.fromCharCode(no.valor);

    return [esquerda, direita, valor]
        .filter(Boolean)
        .map(item => item === " " ? "espaco" : item)
        .join(" → ");
}

    // ============================================
    // DESENHO DA ESTRUTURA DA ÁRVORE
    // ============================================
function renderizarArvore(raiz, container) {
    container.innerHTML = "";

    if (!raiz) {
        return;
    }

    const nivel = document.createElement("div");
    nivel.className = "arvore-nivel raiz-nivel";
    nivel.appendChild(criarNoVisual(raiz));
    container.appendChild(nivel);
}

// ============================================
// DESENHO DOS NÓS E CONECTORES
// ============================================
function criarNoVisual(no) {
    const grupo = document.createElement("div");
    grupo.className = "no-grupo";

    // Cria o nó atual e exibe o caractere armazenado nele.
    const noElemento = document.createElement("span");
    noElemento.className = "no-arvore";
    noElemento.textContent = String.fromCharCode(no.valor);
    noElemento.title = `Código: ${no.valor}`;
    grupo.appendChild(noElemento);

    if (no.esquerda || no.direita) {
        const filhos = document.createElement("div");
        const possuiDoisFilhos = no.esquerda && no.direita;
        filhos.className = possuiDoisFilhos
            ? "filhos-arvore filhos-duplos"
            : "filhos-arvore filhos-unico";

        if (possuiDoisFilhos) {
            // Linha horizontal que conecta os dois filhos ao pai.
            const conector = document.createElement("span");
            conector.className = "conector-horizontal";
            filhos.appendChild(conector);
        }

        // Desenha recursivamente o filho esquerdo.
        if (no.esquerda) {
            const esquerda = document.createElement("div");
            esquerda.className = "filho-arvore filho-esquerdo";
            esquerda.appendChild(criarNoVisual(no.esquerda));
            filhos.appendChild(esquerda);
        }

        // Desenha recursivamente o filho direito.
        if (no.direita) {
            const direita = document.createElement("div");
            direita.className = "filho-arvore filho-direito";
            direita.appendChild(criarNoVisual(no.direita));
            filhos.appendChild(direita);
        }

        grupo.appendChild(filhos);
    }

    return grupo;
}