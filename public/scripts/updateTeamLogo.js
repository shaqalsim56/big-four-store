document.getElementById('teamSelect').addEventListener('change', function() {
    var selectedTeam = this.options[this.selectedIndex];
    var logoUrl = selectedTeam.getAttribute('data-logo-url');
    if (logoUrl) {
        var teamImageDiv = document.getElementById('teamImage');
        teamImageDiv.innerHTML = `<img src="${logoUrl}" alt="Team Logo" class="team-logo">`;
    } else {
        document.getElementById('teamImage').innerHTML = '';
    }
});