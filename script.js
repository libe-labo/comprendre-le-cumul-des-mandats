window.addEventListener('load', function() {
    var texts = [
        'Si votre parlementaire n\'occupe aucune autre fonction, c\'est qu\'il n\'est logiquement pas en situation de cumul&nbsp;: on parle de mandat unique.',
        'Il est impossible d\'être membre de deux conseils municipaux simultanément',
        ['On peut être à la fois ', '. Ce sera toujours le cas après le 1<sup>er</sup> avril 2017.'],
        ['On peut être à la fois ', '. Ce ne sera plus le cas à partir du 1<sup>er</sup> avril 2017, date à partir de laquelle les parlementaires n\'auront plus le droit d\'exercer des fonctions exécutives locales.'],
        ['Un parlementaire n\'a le droit d\'exercer en paralèlle qu\'un seul mandat local&nbsp;: il ne peut donc pas être à la fois ', '.'],
        ['Aucun élu ne peut être le chef de deux exécutifs locaux à la fois. Il est donc impossible d\'être en même temps ', '.'],
        ['Les communes de moins de 1&nbsp;000 habitants ne comptent pas pour le cumul. Du coup, on peut être à la fois ', '. Et ce sera toujours le cas après le 1<sup>er</sup> avril 2017.'],
        ['Les communes de moins de 1&nbsp;000 habitants ne comptent pas pour le cumul. Du coup, on peut être à la fois ', '. Mais à partir du 1<sup>er</sup> avril 2017, les fonctions exécutives locales seront interdites aux parlementaires.'],
        ['Ni les communes de moins de 1&nbsp;000 habitants, ni les intercommunalités ne comptent pour le cumul. Du coup, on peut être à la fois ', '. A partir du 1<sup>er</sup> avril 2017, en revanche, les fonctions exécutives locales seront interdites aux parlementaires.'],
        ['Ni les communes de moins de 1&nbsp;000 habitants, ni les intercommunalités ne comptent pour le cumul. Du coup, on peut être à la fois ', '.']
    ];

    var positions = [
        [ 'maire' , 'adjoint au maire' , 'conseiller municipal' ],
        [ 'maire' , 'adjoint au maire' , 'conseiller municipal' ],
        [ 'président d\'intercommunalité' , 'vice-président d\'intercommunalité' , 'conseiller communautaire' ],
        [ 'président de conseil départemental' , 'vice-président de conseil départemental' , 'conseiller départemental' ],
        [ 'président de conseil régional' , 'vice-président de conseil régional' , 'conseiller régional' ],
    ];

    var positionStr = function(selected, idx) {
        var all = ['parlementaire'];
        selected.forEach(function(pos) {
            if (idx >= 6 && pos[0] === 0) {
                all.push(positions[pos[0]][pos[1]] + ' d’une commune de cette taille');
            } else {
                all.push(positions[pos[0]][pos[1]]);
            }
        });
        return all.join(', ').replace(/,([^,]*)$/, ' et $1');
    };

    var check = function(clicked) {
        if (clicked != null) {
            // Unselect other in column
            [].filter.call(clicked.parentNode.children, function(child) {
                return child !== clicked;
            }).forEach(function(button) {
                button.classList.remove('selected');
            });
        }

        var thirdColumn = document.querySelectorAll('.container ul')[2].parentElement,
            mustResetThirdColumn = true;

        var state = 'green',
            body = document.querySelector('body'),
            all = [], allColumns = [], allRows = [],
            selected = [].slice.call(document.querySelectorAll('.button.selected'));

        var explanation = document.querySelector('.explanation'),
            updateExplanation = function(idx) {
                if (texts[idx] instanceof Array) {
                    explanation.innerHTML = texts[idx][0] + positionStr(all, idx) + texts[idx][1];
                } else {
                    explanation.innerHTML = texts[idx];
                }
            };

        // Handle third column
        selected.forEach(function(button) {
            if (parseInt(button.parentElement.getAttribute('rel')) <= 1) {
                mustResetThirdColumn = false;
            }
        });

        if (mustResetThirdColumn) {
            thirdColumn.classList.add('faded');
            [].slice.call(thirdColumn.querySelectorAll('.button.selected')).forEach(function(button) {
                button.classList.remove('selected');
            });
            selected = [].slice.call(document.querySelectorAll('.button.selected'));
        } else {
            thirdColumn.classList.remove('faded');
        }

        selected.forEach(function(button) {
            all.push([
                parseInt(button.parentElement.getAttribute('rel')),
                parseInt(button.getAttribute('rel'))
            ]);

            allColumns.push(_.last(all)[0]);
            allRows.push(_.last(all)[1]);
        });

        if (_.uniq(allColumns).length !== allColumns.length) {
            // Two selected in the same column
            state = 'red';
        } else {
            var n = _.filter(allColumns, function(d) { return [0, 2].indexOf(d) < 0; }).length;
            if (n > 1) {
                state = 'red';
                if (_.filter(allColumns, function(d) { return [0, 1].indexOf(d) >= 0; }).length > 1) {
                    updateExplanation(1);
                } else {
                    updateExplanation(4);
                }
            } else {
                if (_.filter(allColumns, function(d) { return [0, 1].indexOf(d) >= 0; }).length > 1) {
                    state = 'red';
                    updateExplanation(1);
                } else if (_.filter(all, function(d) { return d[0] !== 2 && d[1] === 0 }).length > 1) {
                    state = 'red';
                    updateExplanation(5);
                } else if (_.filter(allRows, function(d) { return d >= 2; }).length !== allRows.length) {
                    state = 'orange';
                    if (all.length > 1 && _.filter(allColumns, function(d) { return d === 0; }).length > 0) {
                        if (_.filter(allColumns, function(d) { return d === 2; }).length > 0) {
                            updateExplanation(8);
                        } else {
                            updateExplanation(7);
                        }
                    } else {
                        updateExplanation(3);
                    }
                } else {
                    // Green
                    if (all.length <= 0) {
                        updateExplanation(0);
                    } else {
                        if (all.length > 1 && _.filter(allColumns, function(d) { return d === 0; }).length > 0) {
                            if (_.filter(allColumns, function(d) { return d === 2; }).length > 0) {
                                updateExplanation(9);
                            } else {
                                updateExplanation(6);
                            }
                        } else {
                            updateExplanation(2);
                        }
                    }
                }
            }
        }

        body.classList.remove('green', 'red', 'orange');
        body.classList.add(state);
    };

    var buttons = [].slice.call(document.querySelectorAll('.button'));

    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            if (!this.parentElement.parentElement.classList.contains('faded')) {
                this.classList.toggle('selected');

                check(this);
            }
        })
    });

    check();

    $('.reset').on('click', function() {
        $('.selected').removeClass('selected');
        check();
    });
});
