(function () {
    'use strict';

    // High scores data: one entry per row (Rank is computed when rendering)
    var scores = [
        { player: 'Ava', moves: 22, time: 58, date: '2026-01-10' },
        { player: 'Noah', moves: 24, time: 63, date: '2026-01-09' },
        { player: 'Mia', moves: 26, time: 71, date: '2026-01-08' },
        { player: 'Liam', moves: 27, time: 75, date: '2026-01-07' },
        { player: 'Zoe', moves: 29, time: 82, date: '2026-01-06' },
        { player: 'Ethan', moves: 30, time: 88, date: '2026-01-06' },
        { player: 'Ivy', moves: 31, time: 90, date: '2026-01-05' },
        { player: 'Sam', moves: 33, time: 95, date: '2026-01-05' },
        { player: 'Kai', moves: 34, time: 101, date: '2026-01-04' },
        { player: 'Emma', moves: 35, time: 104, date: '2026-01-03' }
    ];

    var tbody = document.getElementById('scores-body');
    if (!tbody) return;

    // Clear any existing rows (e.g. from static HTML)
    tbody.innerHTML = '';

    // Build one table row per score; Rank = index + 1
    for (var i = 0; i < scores.length; i++) {
        var s = scores[i];
        var row = document.createElement('tr');
        row.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + s.player + '</td>' +
            '<td>' + s.moves + '</td>' +
            '<td>' + s.time + '</td>' +
            '<td>' + s.date + '</td>';
        tbody.appendChild(row);
    }
})();
