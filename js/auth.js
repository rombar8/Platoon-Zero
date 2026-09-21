// =====================================
// PLATOON ZERO — AUTHENTIFICATION
// =====================================

const authScreen = document.querySelector("#auth-screen");
const mainMenu = document.querySelector("#main-menu");

const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");

const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");

const registerPseudo = document.querySelector("#register-pseudo");
const registerEmail = document.querySelector("#register-email");
const registerPassword = document.querySelector("#register-password");
const registerPasswordConfirm = document.querySelector("#register-password-confirm");

const loginButton = document.querySelector("#login-button");
const registerButton = document.querySelector("#register-button");

const showRegisterButton = document.querySelector("#show-register-button");
const showLoginButton = document.querySelector("#show-login-button");

const authMessage = document.querySelector("#auth-message");


// =====================================
// PROFIL ACTUEL
// =====================================

let currentUser = null;
let currentProfile = null;


// =====================================
// MESSAGE
// =====================================

function showAuthMessage(message, type = "error") {

    authMessage.textContent = message;

    authMessage.classList.remove(
        "error",
        "success"
    );

    authMessage.classList.add(type);
}


// =====================================
// AFFICHAGE DES FORMULAIRES
// =====================================

showRegisterButton.addEventListener("click", () => {

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    showAuthMessage("");
});


showLoginButton.addEventListener("click", () => {

    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");

    showAuthMessage("");
});


// =====================================
// INSCRIPTION
// =====================================

registerButton.addEventListener("click", async () => {

    const pseudo = registerPseudo.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirmation = registerPasswordConfirm.value;

    if (!pseudo || !email || !password || !confirmation) {

        showAuthMessage("Tous les champs sont obligatoires.");
        return;
    }

    if (pseudo.length < 3) {

        showAuthMessage("Le pseudo doit contenir au moins 3 caractères.");
        return;
    }

    if (password.length < 6) {

        showAuthMessage("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    if (password !== confirmation) {

        showAuthMessage("Les mots de passe ne correspondent pas.");
        return;
    }


    registerButton.disabled = true;

    showAuthMessage("Création du compte...", "success");


    const { data, error } = await supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {

            data: {
                pseudo: pseudo
            }

        }

    });


    registerButton.disabled = false;


    if (error) {

        console.error(error);

        showAuthMessage(error.message);
        return;
    }


    console.log("Compte créé :", data.user);

    showAuthMessage(
        "Compte créé avec succès.",
        "success"
    );
});


// =====================================
// CONNEXION
// =====================================

loginButton.addEventListener("click", async () => {

    const email = loginEmail.value.trim();
    const password = loginPassword.value;


    if (!email || !password) {

        showAuthMessage(
            "Entre ton email et ton mot de passe."
        );

        return;
    }


    loginButton.disabled = true;

    showAuthMessage(
        "Connexion...",
        "success"
    );


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,
            password: password

        });


    loginButton.disabled = false;


    if (error) {

        console.error(error);

        showAuthMessage(
            "Email ou mot de passe incorrect."
        );

        return;
    }


    await openPlayerSession(data.user);
});


// =====================================
// OUVERTURE SESSION
// =====================================

async function openPlayerSession(user) {

    currentUser = user;


    const { data: profile, error } =
        await supabaseClient
            .from("profiles")
            .select("id, pseudo, role, created_at")
            .eq("id", user.id)
            .single();


    if (error) {

        console.error(
            "Impossible de charger le profil :",
            error
        );

        showAuthMessage(
            "Impossible de charger le profil."
        );

        return;
    }


    currentProfile = profile;


    console.log(
        "🟢 Joueur connecté :",
        currentProfile
    );


    authScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");


    // Pour l'instant, on réutilise ton ancien champ
    // de pseudo afin de ne pas casser game.js.

    const playerNameInput =
        document.querySelector("#player-name");


    if (playerNameInput) {

        playerNameInput.value =
            currentProfile.pseudo || "OPÉRATEUR";

        playerNameInput.readOnly = true;
    }

    // =====================================
// AFFICHAGE DU COMPTE
// =====================================

const accountPseudo =
    document.querySelector("#account-pseudo");

const accountRole =
    document.querySelector("#account-role");


if (accountPseudo) {

    accountPseudo.textContent =
        currentProfile.pseudo || "OPÉRATEUR";
}


if (accountRole) {

    const roleNames = {
        player: "JOUEUR",
        tester: "TESTER",
        dev: "DÉVELOPPEUR"
    };

    accountRole.textContent =
        roleNames[currentProfile.role] || "JOUEUR";

    accountRole.dataset.role =
        currentProfile.role;
}
}


// =====================================
// SESSION EXISTANTE AU CHARGEMENT
// =====================================

// =====================================
// DÉCONNEXION
// =====================================

const logoutButton =
    document.querySelector("#logout-button");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const { error } =
                await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Erreur déconnexion :",
                    error
                );

                return;
            }


            currentUser = null;
            currentProfile = null;


            mainMenu.classList.add("hidden");
            authScreen.classList.remove("hidden");


            loginPassword.value = "";

            showAuthMessage(
                "Déconnexion réussie.",
                "success"
            );

        }
    );

}

async function checkExistingSession() {

    const { data, error } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Erreur session :",
            error
        );

        return;
    }


    if (data.session?.user) {

        await openPlayerSession(
            data.session.user
        );

    } else {

        authScreen.classList.remove("hidden");
        mainMenu.classList.add("hidden");

    }
}


checkExistingSession();