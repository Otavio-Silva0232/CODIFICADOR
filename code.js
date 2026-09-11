const formulario =
    document.getElementById("loginform");

formulario.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const usuario =
            document
                .getElementById("usuario")
                .value
                .trim();

        const senha =
            document
                .getElementById("senha")
                .value;

        const mensagem =
            document.getElementById("mensagem");


        // ============================================
        // VALIDAÇÃO
        // ============================================

        if (!usuario || !senha) {

            mensagem.textContent =
                "Preencha usuário e senha.";

            mensagem.style.color = "red";

            return;

        }


        try {

            // ========================================
            // ENVIAR LOGIN PARA A API
            // ========================================

            const resposta =
                await fetch("/api/login", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        usuario: usuario,

                        senha: senha

                    })

                });


            const resultado =
                await resposta.json();


            // ========================================
            // LOGIN INCORRETO
            // ========================================

            if (!resposta.ok) {

                mensagem.textContent =
                    resultado.erro ||
                    "Usuário ou senha incorretos.";

                mensagem.style.color = "red";

                return;

            }


            // ========================================
            // LOGIN CORRETO
            // ========================================

            localStorage.setItem(
                "usuarioLogado",
                resultado.usuario
            );


            mensagem.textContent =
                "Login realizado com sucesso!";

            mensagem.style.color = "green";


            setTimeout(function() {

                window.location.href =
                    "/tela_principal/principal.html";

            }, 1000);


        } catch (erro) {

            console.error(erro);

            mensagem.textContent =
                "Não foi possível conectar ao servidor.";

            mensagem.style.color = "red";

        }

    }
);