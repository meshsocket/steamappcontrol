(function () {
    function parseHash() {
        const url = window.location.hash;
        const query = url.substr(1);
        const result = {};
        query.split('&').forEach(function (part) {
            const item = part.split('=');
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    const params = parseHash();
    if (params.port === undefined) {
        alert("You must launch this from Meshsocket.");
        return;
    }

    function inviteFriend(id) {
        fetch('http://127.0.0.1:' + params.port + '/v1/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result && result.error) {
                    alert(result.error);
                }
                console.log(result);
            })
    }

    function loadFriends() {
        const friendsList = document.getElementById('friends-list');
        fetch('http://127.0.0.1:' + params.port + '/v1/friends', {
            method: 'GET',
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (friends) {
                console.log(friends);
                for (let index = 0; index < friends.length; index++) {
                    const friend = friends[index];
                    const friendItem = document.getElementById('friend-template').cloneNode(true);
                    friendItem.removeAttribute('id');
                    for (let i = 0; i < friendItem.childNodes.length; i++) {
                        const node = friendItem.childNodes[i];
                        console.log(node.className);
                        if (node.classList !== undefined && node.classList.contains('friend-name')) {
                            node.innerText = friend.name;
                            continue;
                        }
                        if (node.classList !== undefined && node.classList.contains('invite-button')) {
                            node.addEventListener('click', function (id) {
                                return function () {
                                    inviteFriend(id);
                                };
                            }(friend.id));
                            continue;
                        }
                    }
                    friendsList.appendChild(friendItem);
                }
            });
        console.log(params.port);
    }
    document.addEventListener('DOMContentLoaded', function () {
        loadFriends();
    }, true);

}());
