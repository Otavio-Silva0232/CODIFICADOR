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

        else if (valor > no.valor) {

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

        linhas.push(String(no.valor));

        this.salvar(no.esquerda, linhas);

        this.salvar(no.direita, linhas);

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
    .addEventListener("click", function () {

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


        for (const letra of mensagem) {

            arvore.inserir(
                letra.charCodeAt(0)
            );

        }


        // ====================================
        // GERAR CÓDIGOS
        // ====================================

        const codigos = [];


        for (const letra of mensagem) {

            const codigo =
                arvore.codigo(
                    letra.charCodeAt(0)
                );

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
        // REGISTRO DA MENSAGEM
        // ====================================

        const mensagensSalvas =
            JSON.parse(
                localStorage.getItem("mensagens")
            ) || [];


        const novaMensagem = {

            id: Date.now(),

            remetente: usuarioLogado,

            destinatario: destino,

            assunto: assunto,

            nomeArquivo: nomeArquivo,

            conteudo: conteudo

        };


        mensagensSalvas.push(novaMensagem);


        localStorage.setItem(
            "mensagens",
            JSON.stringify(mensagensSalvas)
        );


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