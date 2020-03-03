(function () {

    /* global $ */
    
    var csrf = null;

    var genericAjax = function (url, data, type, callBack) {
        $.ajax({
            url: url,
            data: data,
            type: type,
            dataType : 'json',
        })
        .done(function( json ) {
            console.log('ajax done');
            console.log(json);
            callBack(json);
        })
        .fail(function( xhr, status, errorThrown ) {
            console.log('ajax fail');
        })
        .always(function( xhr, status ) {
            console.log('ajax always');
        });
    };
    
    var simpleAjax = function (url, callBack) {
        genericAjax(url, null, 'get', callBack);
    };

    var getPageLink = function(page) {
        return `<li class="page-item">
            <a class="page-link active-page" data-page="${page}" href="#">${page}</a>
        </li>`;
    }

    var getPaginator = function (data) {
        let previousOn = 
            `<li class="page-item"  aria-label="« Anterior">
                <a class="page-link active-page" href="#" data-page="${data.current_page-1}" rel="previous" aria-label="« Anterior">‹</a>
            </li>`;
        let previousOff = 
            `<li class="page-item disabled" aria-disabled="true" aria-label="« Anterior">
                <span class="page-link" aria-hidden="true">‹</span>
            </li>`;
        let nextOn =
            `<li class="page-item">
                <a class="page-link active-page" data-page="${data.current_page+1}" href="#" rel="next" aria-label="Siguiente »">›</a>
            </li>`;
        let nextOff =
            `<li class="page-item disabled" aria-disabled="true" aria-label="Siguiente »">
                <span class="page-link" aria-hidden="true">›</span>
            </li>`;
        let current = 
            `<li class="page-item active" aria-current="page">
                <span class="page-link">${data.current_page}</span>
            </li>`;
        let between =
            `<li class="page-item disabled" aria-disabled="true">
                <span class="page-link">...</span>
            </li>`;
            
        var result = '';
        if(data.current_page == 1){
            result += previousOff;
        } else {
            result += previousOn;
        }
        if(data.current_page > 2){
            result += between;
        } 
        
        for (var i = data.current_page-2; i <= data.current_page+2; i++ ){
            if( i < 1 ){
                
            } else if( i > data.last_page ){
                
            } else if( i == data.current_page ){
              result += current;
            } else{
                result += getPageLink(i);
            }
        }
        
        if(data.current_page < data.last_page-1){
            result += between;
        } 
        if(data.current_page == data.last_page){
            result += nextOff;
        } else {
            result += nextOn;
        }
        return result;
            
    }
    
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    
    var getPokemonBody = function (response) {
        var champsData = response.champs.data;
        var content = '';
        for(var i = 0; i < champsData.length; i++){
            content += getPokemonTr(champsData[i], response.authenticated, response.rooturl);
        }
        return content;
    };

    var getPokemonRowField = function(row, field) {
        var content = '';
        if(field !== 'id' && field !== 'deleted_at') {
            console.log(field);
            if(field === 'file') {
                content += '<td><img src="pokemon/image/file/' + row['file'] + '" width="60px"></td>';
                content += '<td><img src="pokemon/image/id/' + row['id'] + '" width="60px"></td>';
            } else {
                content += '<td>' + row[field] + '</td>';
            }
        }
        return content;
    };

   
    
      var getPokemonTr = function(row, authenticated, rootUrl) {
        var content='';
        content += '<td>' + row.id + '</td>';
        content += '<td>' + row.nombre + '</td>';
        content += '<td>' + row.dificultad + '</td>';
        content += '<td>' + row.rol + '</td>';
        content += '<td><img src="' + rootUrl + '/pokemon/image/file/' + row['file'] + '" width="60px"></td>';
        content += '<td><img src="' + rootUrl + '/pokemon/image/id/' + row['id'] + '" width="60px"></td>';
        if(authenticated) {
            content += '<td>edit</td>';
            content += '<td>delete</td>';
        }
        //for(var field in row) {
            //content += getPokemonRowField(row, field);
            //content += '<td>' + row[field] + '</td>';
            //content += '<td>' + row.field + '</td>';
            //content += '<td>' + row.id + '</td>';
        //}
        return '<tr>'+content+'</tr>';
    };
    
    var request = function(pagenumber, history = true){
        genericAjax('indexajax', { page: pagenumber }, 'get', function(param1) {
           $('#pokemonBody').empty();
           $('#pokemonPaginator').empty();
           $('#pokemonBody').append(getPokemonBody(param1));
           $('#pokemonPaginator').append(getPaginator(param1.pokemons));
           if(history) {
               window.history.pushState({ id: pagenumber }, null, '?page=' + pagenumber);
           }
           if (param1.authenticated) {
               $("#userName").removeClass('d-none');
           } else {
               $("#userName").addClass('d-none');
           }
           csrf = param1.csrf;
        });
    }
    
    window.onpopstate = function (e) {
        console.log(e);
        var id = e.state.id;
        request(id, false);
    };

    if($('#pokemonBody').length > 0) {
        var page = getParameterByName('page');
        if(!page) {
            page = 1;
        }
        request(page);
    }
    
    $('#pokemonPaginator').on('click', '.active-page', function(event) {
        event.preventDefault();
        console.log($(this).attr('data-page'));
        var page = $(this).attr('data-page');
        request(page);
    });
    
    $('#name').blur(function(event) {
        var valor = $('#name').val();
        if(valor.trim() !== '') {
            simpleAjax('pokemonnameajax/' + valor, function(ajax) {
               if(ajax.response) {
                   $('#messageName').text(': no se puede usar');
               } else {
                   $('#messageName').text(': sí se puede usar');
               }
            });
        }
    });
    
    $('#btAddPokemon').click(function () {
        //if(cumpleTodasLasCondiciones)
        var nameVal = $('#name').val();
        var heightVal = $('#height').val();
        var weightVal = $('#weight').val();
        var typeVal = $('#type').val();
        genericAjax('pokemonajax', { name: nameVal, height: heightVal, weight: weightVal, type: typeVal, _token: csrf }, 'post', function(ajax) {
           if(ajax.response) {
               $('#name, #weight, #height, #type').val('');
               //$('#addPokemonModal').modal('hide');
           } else {
               alert('No');
           }
           csrf = ajax.csrf;
        });
    });
    
    let form = document.getElementById("searchForm");
    form.addEventListener("submit", function ( event ) {
        event.preventDefault();
        const FD = new FormData(form);
        console.log(FD);
        formAjax('pokemonajax2', FD, 'post', function (ajax) {
            console.log(ajax);
        });
    });

})();