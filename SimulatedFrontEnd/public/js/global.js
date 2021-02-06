$('#logoutButton').on('click', function(event) {
    const baseUrl = 'http://18.233.43.217:5000';
    event.preventDefault();
    let token = localStorage.getItem('token')
    let webFormData = new FormData();
    webFormData.append('token', token);
    axios({
        method: 'post',
        url: baseUrl + '/api/user/logout',
        data: webFormData,
        headers: {'Authorization': 'Bearer ' + token }
    })
    localStorage.clear();
    window.location.replace('/home.html');
});