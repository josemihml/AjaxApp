
$.ajaxSetup({
     headers: {
         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')     
     }
 }); 
 
 
$.ajax({
   url: "getChamp",
   method: "get",
   dataType: 'JSON',
   success: function(response){
        console.log(response);
        pintarTabla(response);
        console.log('Ajax works!');
   },
   error: function(e){
        console.log(e);
 
   },
   complete : function() {
       $("#addCS").click(function(e) {
          var path =$('input[name=imagen]').val(); 
          var filename = path.replace(/C:\\fakepath\\/, '');
          $.ajax({
              url:"addChamp",
              type: 'POST',
              dataType: 'JSON',
              data: {
                "_token": $('input[name=_token]').val(),
                'nombre': $('input[name=nombre]').val(),
                'desc'  : $('input[name=desc]').val(),
                'rol'   : $('input[name=rol]').val(),
                'linea' : $('input[name=linea]').val(),
                'dificultad' : $('input[name=dificultad]').val(),
                'imagen' :filename,
              },
              success:function(response){
                console.log('Ajax add!');
                console.log(response);
                pintarTabla(response);
                $('#create').modal('hide');
              },
              error:function(e){
                   console.log(e);
              }
          })
    });
    
    $("#editCS").click(function(e){
        e.preventDefault();
        var path =$('input[name=imagenE]').val(); 
        var filename = path.replace(/C:\\fakepath\\/, '');
        datos = {
            
                '_token':  $('input[name=_token]').val(),
                'id'    : $('input[name=idE]').val(),
                'nombre': $('input[name=nombreE]').val(),
                'desc'  : $('input[name=descE]').val(),
                'rol'   : $('input[name=rolE]').val(),
                'linea' : $('input[name=lineaE]').val(),
                'dificultad' : $('input[name=dificultadE]').val(),
                'imagen' : filename,
            };
           $.ajax({
            url:'champ/'+$('input[name=idE]').val(),
            type: 'POST',
            dataType: 'JSON',
            data: datos,
            success:function(response){
                console.log(response);
                actualizarTabla(response);
               
                console.log('Ajax edit works!');
                console.log(response);
                $('#edit').modal('hide');
            },
            error:function(ev){
                alert('Fallo en la base de datos (Clave duplicada o valor no nulo)');
                
            }
        })
            
    });
    
    
    
   

    

    $(document).on('click','.create-modal', function() {
        $('#create').modal('show');
        $('.form-horizontal').show();
        $('.modal-title').text('Add Post');
    });
    
    $(document).on('click','.eButton' , function(e){
       alert("Estás editando "+$("#nombre"+e.target.dataset.id).text());
       $('#edit').modal('show');
       $('input[name=idE]').val(e.target.dataset.id);
       $('input[name=nombreE]').val($("#nombre"+e.target.dataset.id).text());
       $('input[name=descE]').val($("#desc"+e.target.dataset.id).text());
       $('input[name=rolE]').val($("#rol"+e.target.dataset.id).text());
       $('input[name=lineaE]').val($("#linea"+e.target.dataset.id).text());
       $('input[name=dificultadE]').val($("#dificultad"+e.target.dataset.id).text());
       $('input[name=imagenE]').val($("#imagen"+e.target.dataset.id).text());
      
    });

    $(document).on('click','.dButton',function(e){
        if(confirm("¿Seguro que tiene eliminar este campeón?")){
            $.ajax({
                url: 'champ/'+e.target.dataset.id+'/delete',
                type:'POST',
                dataType: 'JSON',
                data:{
                    '_token':  $('input[name=_token]').val(),
                    'id':e.target.dataset.id,
                },
            success:function(response){
                alert("Borrado con exito");
                console.log(response);
                pintarTabla(response);
            },
            error:function(ev){
                console.log(ev);
            }
                
            })
        }else{
            return false;
        };
    });
    
   }
    });
    
    
 


function pintarTabla(response){
     $("#champBody").empty();
        var content="";
        for(var i=0; i<response.champs.data.length;i++){
            content+= '<tr class="champ'+ response.champs.data[i].id +'">';
            content+= '<td scope="row" id=id'+response.champs.data[i].id+'>'+response.champs.data[i].id+'</td>';
            content+= '<td  id=nombre'+response.champs.data[i].id+'>'+response.champs.data[i].nombre+'</td>';
            content+= '<td id=desc'+response.champs.data[i].id+'>'+response.champs.data[i].desc+'</td>';
            content+= '<td id=rol'+response.champs.data[i].id+'>'+response.champs.data[i].rol+'</td>';
            content+= '<td id=linea'+response.champs.data[i].id+'>'+response.champs.data[i].linea+'</td>';
            content+= '<td id=dificultad'+response.champs.data[i].id+'>'+response.champs.data[i].dificultad+'</td>';
            content+= '<td id=imagen'+response.champs.data[i].id+' hidden >'+response.champs.data[i].imagen+'</td>';
            content+= '<td><button type="button" data-id="'+response.champs.data[i].id+'" class="btn btn-primary eButton">Editar</button></td>';
            content+= '<td><button type="button" id="dButton" data-token="{{ csrf_token() }}"  data-id="'+response.champs.data[i].id+'" class="btn btn-danger dButton">Eliminar</button></td>';
            content+='</tr>';
        }
        
        $('#champBody').append(content);
       
}

function actualizarTabla(response){
         $('.champ' + response.champ.id).replaceWith(" "+
          "<tr class='champ" +  response.champ.id + "'>"+
          "<td scope='row' id=id"+response.champ.id+">" + response.champ.id + "</td>"+
          "<td id=nombre"+response.champ.nombre+"' >" + response.champ.nombre + "</td>"+
          "<td id=desc"+response.champ.desc+">" + response.champ.desc + "</td>"+
          "<td id=rol"+response.champ.rol+">" +response.champ.rol + "</td>"+
          "<td id=linea"+response.champ.linea+">" + response.champ.linea + "</td>"+
          "<td id=dificultad"+response.champ.dificultad+">" + response.champ.dificultad + "</td>"+
          "<td id=imagen"+response.champ.imagen+" hidden>" + response.champ.imagen + "</td>"+
          "<td><button type='button' data-id="+response.champ.id+" class='btn btn-primary eButton'>Editar</button></td>"+
          "<td><button type='button' id='dButton' data-token='{{ csrf_token() }}' data-id="+response.champ.id+" class='btn btn-danger dButton'>Eliminar</button></td>"+
          "</tr>");
        };

