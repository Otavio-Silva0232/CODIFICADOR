const usuarios = [
    {
        usuario: "admin_niteroi",
        senha: "1234"
    },
    {
        usuario: "admin_marica",
        senha: "4321"
    }
];

const formulario = document.getElementById("loginform");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuarioDigitado = document.getElementById("usuario").value;
    const senhaDigitada = document.getElementById("senha").value;

    const mensagem = document.getElementById("mensagem");

    const usuarioEncontrado = usuarios.find(function(usuario) {

        return usuario.usuario === usuarioDigitado &&
               usuario.senha === senhaDigitada;

    });

    if (usuarioEncontrado) {

        // Guarda quem fez o login
        localStorage.setItem("usuarioLogado", usuarioEncontrado.usuario);

        mensagem.textContent = "Login realizado com sucesso!";
        mensagem.style.color = "green";

        // Vai para a tela principal
        setTimeout(function() {
            window.location.href = "/tela_principal/principal.html";
        }, 1000);

    } else {

        mensagem.textContent = "Usuário ou senha incorretos!";
        mensagem.style.color = "red";

    }

});