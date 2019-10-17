$('.login-reg-panel input[type="radio"]').on('change', function () {
    if ($('#log-login-show').is(':checked')) {
        $("#registerInfoMsg").text("");
        $("#loginInfoMsg").text("");
        
        $('#registerUserName').val("");
        $('#registerEmail').val("");
        $('#registerPswd').val("");
        $('#loginEmail').val("");
        $('#loginPswd').val("");

        $('.register-info-box').fadeOut();
        $('.login-info-box').fadeIn();

        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');

    }
    else if ($('#log-reg-show').is(':checked')) {
        $("#registerInfoMsg").text("");
        $("#loginInfoMsg").text("");
        $('#registerUserName').val("");
        $('#registerEmail').val("");
        $('#registerPswd').val("");
        $('#loginEmail').val("");
        $('#loginPswd').val("");

        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();

        $('.white-panel').removeClass('right-log');

        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');
    }
});

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {

        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;

            console.log(JSON.stringify(user, null, '  '));

            // [END_EXCLUDE]
        } else {
            // User is signed out.
            console.log("user signed out");
            // [START_EXCLUDE]
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]

        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('login').addEventListener('click', toggleSignIn, false);
    document.getElementById('register').addEventListener('click', handleSignUp, false);
}


window.onload = function () {

    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');
    $("#registerInfoMsg").text("");
    $("#loginInfoMsg").text("");

    var firebaseConfig = {
        apiKey: "AIzaSyB0L_zmqWF5nPq7AjgyOuh6LvMMBPpltz8",
        authDomain: "daydashboard.firebaseapp.com",
        databaseURL: "https://daydashboard.firebaseio.com",
        projectId: "daydashboard",
        storageBucket: "daydashboard.appspot.com",
        messagingSenderId: "601335236816",
        appId: "1:601335236816:web:d14de5c8167c18efb676d5"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    initApp();
};



function handleSignUp() {
    var userName = document.getElementById('registerUserName').value;
    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPswd').value;
    if (email.length < 4) {
        $("#registerInfoMsg").css("color","red").text('**Please enter an email address.');
        return;
    }
    if (password.length < 4) {        
        $("#registerInfoMsg").css("color","red").text('**Please enter a password.');        
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (user) {
            if (firebase.auth().currentUser) {
                firebase.auth().currentUser.updateProfile({
                    displayName: userName,
                }).then(function () {
                    console.log("successful");
                    $('#registerUserName').val("");
                    $('#registerEmail').val("");
                    $('#registerPswd').val("");
                    $("#registerInfoMsg").css("color","green").text('Succesfully Registered'); 
                    //add the user to the database
                    var emailmodified=email.replace("@", "atrateof");
                    var emailmodified1=emailmodified.replace(".", "dot");
                    fireUpdate(userName, emailmodified1);
                }).catch(function (error) {
                    $("#registerInfoMsg").css("color","red").text("**"+error);
                    console.log("failure");
                });
            }
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
                $("#registerInfoMsg").css("color","red").text('**The password is too weak.');
            } else {
                $("#registerInfoMsg").css("color","red").text("**"+ errorMessage);
            }
            console.log(error);

        });

}

function fireUpdate(data1, data2) {
    var userInputRef = firebase.database().ref("users/" +  data2 + "/");
    userInputRef.set({
        userName: data1,
    })
};

/**
     * Handles the sign in button press.
     */
function toggleSignIn() {
    // if (firebase.auth().currentUser) {
    //   // [START signout]
    //   firebase.auth().signOut();
    //   // [END signout]
    // } else {

    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPswd').value;

    if (email.length < 4) {
        $("#loginInfoMsg").css("color","red").text("**Please enter an email address.");
        return;
    }
    if (password.length < 4) {
        $("#loginInfoMsg").css("color","red").text("**Please enter a password.");
        return;
    }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            if (user) {
                console.log("succesful log in");
                console.log(user.user.displayName);
                var name = user.user.displayName;
                sessionStorage.clear();
                sessionStorage.setItem("name", name);
                sessionStorage.setItem("email", email);
                var emailmodified=email.replace("@", "atrateof");
                var emailmodified1=emailmodified.replace(".", "dot");
                sessionStorage.setItem("userEmail", emailmodified1);
                window.location.replace("dashboard.html");
            }
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                $("#loginInfoMsg").css("color","red").text("**Wrong Password");
            } else {
                $("#loginInfoMsg").css("color","red").text("**"+errorMessage);
            }
            console.log(error);

        });
}

// }


function onSignIn(googleUser) {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            // [START googlecredential]
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.getAuthResponse().id_token);
            // [END googlecredential]
            // Sign in with credential from the Google user.
            // [START authwithcred]
            firebase.auth().signInWithCredential(credential).then(function (user) {
                if (user) {
                    console.log("succesful log in");
                    console.log(user.user.displayName);

                    //var name = user.user.displayName;
                    // var email=user.user.email;                    
                    // sessionStorage.clear();
                    // sessionStorage.setItem("name", name);
                    // sessionStorage.setItem("email", email);

                    window.location.replace("dashboard.html");
                }
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // [START_EXCLUDE]
                if (errorCode === 'auth/account-exists-with-different-credential') {
                    $("#loginInfoMsg").css("color","red").text('**You have already signed up with a different auth provider for that email.');
                } else {
                    console.error(error);
                    $("#loginInfoMsg").css("color","red").text("**"+errorMessage);
                }
                // [END_EXCLUDE]
            });
            // [END authwithcred]
        } else {
            console.log('User already signed-in Firebase.');
        }
    });
}

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}
