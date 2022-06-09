/* GLOBAL VAR */

let currentEmoloyee;
let personnelID = [];
let locationsID = [];
let departOption;
let locations = [];
let departments = [];
let departmentsID = [];
let sortBy;
let database = [];
let editDepartmentsID;
let departmentsList = [];
let locationsList = [];
let filterTerm;
let departmentValue;
let locationValue;
let hasEmployeesToggle = false;


 
/* FUNCTIONS */

/////////////////////////////////  SEARCH FUNCTION     //////////////////////////////////////////////
//SEARCH

$('#search_box').on('keyup keypress', event => {

    var searchTerm = $('#search_box').val().toLowerCase();


    if(searchTerm){

        //
        $.ajax({
            url:'libs/php/search.php',
            type:'POST',
            dataType: 'json',
            data:{
                searchTerm : searchTerm
            },

            success:(result) => {
                
                let data = result['data']['personnel'];
                displayCards(data);


                $('#buttons').css("height", "30px");
                $('#backBtn').slideDown("fast", "swing");   

            }, error: function(errorThrown) {
                console.log(errorThrown);
            }
        });
    }

});

 
////////////////////////////////////ADD BTNS (NAVBAR) //////////////////////////////////////////////////

// ADD NEW EMPLOYEE

$('#addNewPersonnel').on('click', event => {

    $('#add-department').css('display', 'none');
    $('#add-location').css('display', 'none');
    $('#add-employee').css('display', 'block');
    $('#addNewPersonnel').css('font-weight', '900');
    $('#addNewDepartment').css('font-weight', '400');
    $('#addNewLocation').css('font-weight', '400');

    $('#add-employee')[0].reset();
    $('#add-department')[0].reset();
    $('#add-location')[0].reset();

})

$('#plus-addon').on('click', event => {

    $('#add-department').css('display', 'none');
    $('#add-location').css('display', 'none');
    $('#add-employee').css('display', 'block');
    $('#addNewPersonnel').css('font-weight', '900');
    $('#addNewDepartment').css('font-weight', '400');
    $('#addNewLocation').css('font-weight', '400');

    resetInfoModalContent();
    updateDepartments('department');
    $('#add-all-modal').modal('show');

    $('#add-employee').on('submit', event =>  {

        event.preventDefault();
        event.stopPropagation();
        $('#addAllButton').attr("disabled", 'disabled')
                    .html(`<span class="spinner-border spinner-border-sm text-light"></span><span>Loading</span>`);
                        
        
        
		let addName = document.getElementById("firstName").value;
		let addSurname = document.getElementById("lastName").value;
		let addEmail = document.getElementById("email").value;
		let addJobTitle = document.getElementById("jobTitle").value;
		let addDepartment = document.getElementById("department").value; 
	
		$('#department').change(function() {
			addDepartment = $(this).find('option:selected').data('value');
		});

      
        if(addName && addSurname && addEmail) {
            
            //SEND 
            $.ajax({

                url:'libs/php/addPersonnelByID.php',
                type:'POST',
                dataType: 'json',
                data:{
                    firstName: addName,
                    lastName: addSurname,
                    email: addEmail,
                    jobTitle: addJobTitle, 
                    department: addDepartment
                },
    
                success:(result) => {

                    document.getElementById('firstName').value = "";
                    document.getElementById('lastName').value = "";
                    document.getElementById('email').value = "";
                    document.getElementById('jobTitle').value = "";
                    $('#addAllButton').html(`Save`).attr("disabled", false);
    
    
                    resetInfoModalContent();
                    $('#add-all-modal').modal('hide');
                    $('#infoModalContent').append(`<h5>Success!</h5>
                        <p>Employee ${addName} ${addSurname} successfully added.</p>`);
                    $('#infoModal').modal('show');
                    $('#cards').empty();
                    getEmployeeList();
                    
                  
                }, error: function(errorThrown) {
                    $('#addAllButton').html(`Save`).attr("disabled", false);
                    $('#add-all-modal').modal('hide');
                    resetInfoModalContent();
                    $('#infoModalContent').append(`<h5 style="color:red">Error!</h5><br><p>Please fill in all required fields.</p>`);
                    $('#infoModal').modal('show');
                }
            });
        }

    });

});

 //ADD DEPARTMENT             
 $('#addNewDepartment').on('click', event => {

    $('#add-employee')[0].reset();
    $('#add-department')[0].reset();
    $('#add-location')[0].reset();

    $('#add-employee').css('display', 'none');
    $('#add-location').css('display', 'none');
    $('#add-department').css('display', 'block');
    
    $('#addNewPersonnel').css('font-weight', '400');
    $('#addNewDepartment').css('font-weight', '900');
    $('#addNewLocation').css('font-weight', '400');

    document.getElementById('locationNewDepartment').value = "";
    updateLocations(`#locationNewDepartment`);

    
    $('#add-department').on('submit', event => {

        event.preventDefault();
        event.stopPropagation();

        $('.btn-primary').html(`<span class="spinner-border spinner-border-sm text-light"></span><span>Loading</span>`)
                   .attr("disabled", true);

        let newDepartment =  document.getElementById('newDepartment').value;
        let locationNewDepartment = document.getElementById("locationNewDepartment").value;
    
        $('#locationNewDepartment').click(function() {
            locationNewDepartment = $(this).find('option:selected').data('value');
        });

        if(newDepartment) {

            $.ajax({

                url:'libs/php/insertDepartment.php',
                type:'POST',
                dataType: 'json',
                data:{
                    name : newDepartment,
                    locationID : locationNewDepartment
                },

                success:(result) => {
                    $('#add-all-modal').modal('hide');
                    document.getElementById("newDepartment").value = "";
                    resetInfoModalContent();
                    
                    $('#infoModalContent').html(`<h5>Success!</h5><p>Department ${newDepartment} successfully added.</p>`);
                    $('#infoModal').modal('show');
                    $('.btn-primary').html("Save").attr("disabled", false);
                    resetInformation('d');
                         
                }, error: function(jqXHR, textStatus, errorThrown) {
                    $('.btn-primary').html("Save").attr("disabled", false);

                    $('#add-all-modal').modal('hide');  
                    resetInfoModalContent();
                    $('#infoModalContent').append(`<h5 style="color:red">Error!</h5><br><p>Please fill in all required fields.</p>`);
                    $('#infoModal').modal('show'); 
                    console.log(jqXHR, textStatus, errorThrown);
                }
            });
        } else {
            
            document.getElementById("newDepartment").value = "";
            $('#addAllButton').html("Save").attr("disabled", false);

            $('#infoModalContent').html(``)
            resetInfoModalContent();
            $('#add-all-modal').removeData();
            $('#infoModalContent').html(`<h5 style="color:red">Error!</h5><br><p>Please fill in all required fields.</p>`);
             $('#infoModal').modal('show');
        }
    });
});




//ADD LOCATION               
$('#addNewLocation').on('click', event => {

    $('#add-employee')[0].reset();
    $('#add-department')[0].reset();
    $('#add-location')[0].reset();

    $('#add-employee').css('display', 'none');
    $('#add-department').css('display', 'none');
    $('#add-location').css('display', 'block');
    
    $('#addNewPersonnel').css('font-weight', '400');
    $('#addNewDepartment').css('font-weight', '400');
    $('#addNewLocation').css('font-weight', '900');

    $('#add-location').on('submit', event => {

        event.preventDefault();
        event.stopPropagation();

        $('#addAllButton').html(`<span class="spinner-border spinner-border-sm text-light"></span><span>Loading</span>`)
                    .attr("disabled", true);

        let newLocation = document.getElementById('newLocation').value;

        if(newLocation) {

            $.ajax({

                url:'libs/php/insertLocation.php',
                type:'POST',
                dataType: 'json',
                data:{
                    name : newLocation
                },

                success:(result) => {
                    document.getElementById("newLocation").value = "";
                    getAllLocations();
                    displayLocationCards(locationsList);
                    //resetInformation('l');
                    $('#addAllButton').html("Save").attr("disabled", false);
                    resetInfoModalContent();
                    $('#add-all-modal').modal('hide');
                    
                    $('#infoModalContent').html(`<h5>Success!</h5><br>
                        <p>${newLocation} added successfully.</p>`);
                    $('#infoModal').modal('show'); 
                    
                    
                    
                }, error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR, textStatus, errorThrown);
                        $('#add-all-modal').modal('hide');
                        $('#addAllButton').html("Save").attr("disabled", false);

                        resetInfoModalContent();
                        $('#infoModalContent').append(`<h5 style="color:red">Error!</h5>`);
                        $('#infoModal').modal('show'); 
                }
            });

        } else {
            document.getElementById("newLocation").value = "";
            $('#infoModalContent').html(``)
            $('#locationModalBody').empty()
            $('#infoModalContent').html(`<p>Error.</p>`);
             $('#infoModal').modal('show');
        }

    });

})



////////////FILTERS////////////////////////////////////////////////////////////////////////////////////

function addFilterOptions() {

    $('#departmentFilterDropdown').empty();
    $('#locationFilterDropdown').empty();

   
    departmentsList.forEach(element => {
                
        $('#departmentFilterDropdown').append(`<a class="dropdown-item" id="filterDepartment${element.id}" value="${element.name}">${element.name}</a>`);
        $(`#filterDepartment${element.id}`).on('click', function() {
            
            departmentValue = element.id;
            
            selectItem(departmentValue, locationValue = null);
            
        });
    });

    locationsList.forEach(element => {
                
        $('#locationFilterDropdown').append(`<a class="dropdown-item" id="filterLocation${element.id}" value="${element.name}">${element.name}</a>`);
        $(`#filterLocation${element.id}`).on('click', function() {

            locationValue = element.id;

            selectItem(departmentValue = null, locationValue);
        })
    });
}



//FILTERS 
$('#filter-icon-span').on('click', event => {

    $('#filter_options').slideToggle("slow", function () {
        addFilterOptions();  
    });
    
});



function selectItem(departmentValue, locationValue) {
    
    
    $.ajax({
        url:'libs/php/filter.php',
        type:'POST',
        dataType: 'json',
        data:{
            department: departmentValue,
            location: locationValue 
        },

        success:(result) => {
            
            let data = result['data']['personnel'];
            displayCards(data);

            $('#buttons').css("height", "30px");
            $('#backBtn').slideDown("fast", "swing");   

        }, error: function(errorThrown) {
            console.log(errorThrown);
        }
});
}

//DISPLAY BTNS EVENT HANDLERS
$('#display-icon-span').on('click', event => {
    $('.display-options').slideToggle("slow");
});

$('#display-personnel-icon-span').on('click', event => {
    $('#cards').empty();
    getEmployeeList();
});

$('#display-location-icon-span').on('click', event => {
    displayLocationCards(locationsList);
});

$('#display-department-icon-span').on('click', event => {
    displayDepartmentCards(departmentsList);
});


///////////////////////////////LOCATION AND DEPARTMENT CARDS ///////////////////////////////////////////////

const displayLocationCards = (data) => {

    $('#cards').empty();
    
    data.forEach(element => {
        
        let number = element.id;
        let cardLocation = departmentsList.filter(element => element.locationID === number);
      
        let card = `<div class="card" id="${element.id}">
                        <div class="card-header small">
                        ${element.name} 
                            <span class="delete_Btn">
                                <i class="fa-solid fa-trash"></i>
                            </span>
                            <span class="edit_Btn" id="edit-location${element.id}">
                                <i class="fa-solid fa-pen"></i>
                            </span>
                        </div>
                        <div class="card-body">
                            <blockquote class="blockquote mb-0">
                                <p class="card-element">Employees: <span id="employeeLoc${element.id}"></span></p>
                                <p class="card-element">Departments: <span id="departmentInLocation${element.id}"></span></p>
                            </blockquote>
                        </div>
                    </div>`;


        $('#cards').append(card);

        for(let i = 0; i < cardLocation.length; i++) {
            $(`#departmentInLocation${element.id}`).append(cardLocation[i]['name'] + `, `);

        }

        let editModal =  `<div class="modal fade" id="editModal${element.id}" tabindex="-1" role="dialog" aria-labelledby="editModalLabel">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Edit Location</h5>
                                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                        <div class="modal-body" id="editModalContent">
                                            <tr>
                                                <th class="text-center" scope="row">Location:</th>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <div class="input-group mb-3">
                                                    <input type="text" id="edit${element.id}" class="form-control" value="${element.name}" aria-label="Default" aria-describedby="inputGroup-sizing-default">
                                                    </div>
                                                </th>
                                            </tr>     
                                        </div>

                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-primary" id="editModalSubmit${element.id}">Save</button>
                                            <button type="button" class="btn btn-secondary" id="editModalClose" data-bs-dismiss="modal">Close</button>
                                        </div>

                                    </div>
                                </div>
                            </div>`;
        
        $(`.edit_Btn`).click(function(){

            var locId =  $(this).closest('.card').attr('id');
            var locName =  $(this).closest('.card-header').text().trim();
                
            $(`#editDepOrLocModal`).append(editModal);
            $(`#editModal${locId}`).modal('show');
    
    
            $(`#editModalSubmit${locId}`).on('click', event => {
                let inputValue = document.getElementById(`edit${locId}`).value
                
                updateSelectedLocation(locId, inputValue);
    
            })
        
        });
    });

    $(`.delete_Btn`).click(function(){

        var locId =  $(this).closest('.card').attr('id');
        var locName =  $(this).closest('.card-header').text().trim();

            
        $.ajax({

            url:'libs/php/getTotalEmployeeBy.php',
            type:'POST',
            dataType: 'json',
            async: false,
            data:{
                info : "l.id =",
                id: locId
            },

            success:(result) => {

                if(Number(result.data[0].pc) === 0) {
                    hasEmployeesToggle = true;
                } else {
                    hasEmployeesToggle = false;
                }

            }, error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
            }
        });

        if(hasEmployeesToggle) {
           
            resetInfoModalContent()
            $('.btn-secondary').hide();
            $('#infoModalContent').append(`<p>Are you sure you want to delete this record (<span style="font-style: italic;">${locName}</span>)?</p>`)
            $('#infoModalFooter').append(`<button type="submit" class="btn btn-primary yes">Yes</button>`)
            $('#infoModalFooter').append(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">No</button>`)

            $('#infoModal').modal('show');

            $(".yes").on('click', Event => {

                deleteSelectedLocation(locId, locName);
                
            });
    
        } else if(!hasEmployeesToggle){
    
            resetInfoModalContent();
            $('#infoModalContent').append(`<h5 style="color:red">Error!</h5><br>
                <p>${locName} still has employees attached.</p>`);
            $(`#infoModal`).modal('show');
    
        }
       

    });
        
    locationsList.forEach(location => {
        getTotalEmployees(`l.id = `, `${location.id}`, `employeeLoc`, locationsList)
    });

}


const updateSelectedLocation = (updateId, inputValue) => {


    if(inputValue) {

            
        $.ajax({

            url:'libs/php/updateLocationById.php',
            type:'POST',
            dataType: 'json',
            data:{
                id: updateId,
                name: inputValue
            },

            success:(result) => {
                resetInformation('l');
                resetInfoModalContent();

                $(`#editModal${updateId}`).empty();
                $(`#editModal${updateId}`).modal('hide');
         
                $('#infoModalContent').html(`<h5>Success!</h5><p>Location ${inputValue} updated successfully.</p>`);
                $('#infoModal').modal('show');
                $('#editLocationSubmit').html("Save").attr("disabled", false);

            }, error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
            }
        });


    }


}

const displayDepartmentCards = (data) => {

    $('#cards').empty();
    
    data.forEach(element => {
        
        let number = element.locationID;
        let cardLocation = locationsList.filter(element => element.id === number);
        
        if(cardLocation[0]) {
            
            cardLocation = cardLocation[0]['name'];
        }
        

        let card = `<div class="card" id="${element.id}">
                        <div class="card-header small">${element.name}
                            <span class="delete_Btn">
                                <i class="fa-solid fa-trash"></i>
                            </span>
                            <span class="edit_Btn" id="edit-department${element.id}">
                                <i class="fa-solid fa-pen"></i>
                            </span>
                        </div>
                        <div class="card-body">
                            <blockquote class="blockquote mb-0">
                                <p class="card-element">Employees: <span id="employeeDep${element.id}">${element.id}</span></p>
                                <p class="card-element">Locations: <span id="">${cardLocation}</span></p>
                            </blockquote>
                        </div>
                    </div>`;


        let updateId = element.id;
        $('#cards').append(card);
        $(`#edit-department${element.id}`).on('click', Event => {

            
            $('#editDepOrLocModal').append(`
                        <div class="modal fade" id="editDepartmentModal${element.id}" tabindex="-1" role="dialog" aria-labelledby="editLocationLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5>Edit</h5>
                                    </div>

                                        <div class="modal-body" id="editDepartmentContent">
                                            <tr>
                                                <th scope="row">Department:</th>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <div class="input-group mb-3">
                                                        <input type="text" id="editDepartment${element.id}" value="${element.name}" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
                                                    </div>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th scope="row">Location:</th>
                                            </tr>
                                            <br>
                                            <tr>
                                                <th scope="row">
                                                    <select id="locationEditDepartment${element.id}" class="location"></select>
                                                </th>
                                            </tr>
                                        </div>
                                        
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-primary " id="editDepartmentSubmit${element.id}">Save</button>
                                            <button type="button" class="btn btn-secondary" id="editDepartmentClose" data-bs-dismiss="modal">Close</button>
                                        </div>

                                </div>
                            </div>
                        </div>`);
            
            document.getElementById(`locationEditDepartment${element.id}`).value = "";
            updateLocations(`#locationEditDepartment${element.id}`);
            $(`#editDepartmentModal${element.id}`).modal('show');
            $(`#editDepartmentSubmit${element.id}`).one('click', Event => {
                if(updateId > 0) {
                    let updateDepartmentValue = document.getElementById(`editDepartment${element.id}`).value;
                    let newDepartment = document.getElementById(`locationEditDepartment${element.id}`).value;
                    
                    updateSelectedDepartment(updateId, newDepartment, updateDepartmentValue);
                    
                }
            });
        });

    });

    $(`.delete_Btn`).click(function(){
            
        var deptId =  $(this).closest('.card').attr('id');
        var deptName =  $(this).closest('.card-header').text().trim();

        $.ajax({

            url:'libs/php/getTotalEmployeeBy.php',
            type:'POST',
            dataType: 'json',
            async: false,
            data:{
                info : "d.id =",
                id: deptId
            },

            success:(result) => {
                if(Number(result.data[0].pc) === 0) {
                    hasEmployeesToggle = true;
                } else {
                    hasEmployeesToggle = false;
                }
                
            }, error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
            }
        });

        if(hasEmployeesToggle) {
            
            resetInfoModalContent()
            $('.btn-secondary').hide();
            $('#infoModalContent').append(`<p>Are you sure you want to delete this record (<span style="font-style: italic;">${deptName}</span>)?</p>`)
            $('#infoModalFooter').append(`<button type="submit" class="btn btn-primary yes">Yes</button>`)
            $('#infoModalFooter').append(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">No</button>`)
    
            $('#infoModal').modal('show');
    
            $(".yes").on('click', Event => {
                console.log(4)
                deleteSelectedDepartment(deptId, deptName);
                
            });
        } else {
            resetInfoModalContent();
            $('#infoModalContent').append(`<h5 style="color:red">Error!</h5><br>
                <p>${deptName} still has employees attached.</p>`);
            $(`#infoModal`).modal('show');
        }

    });
   

    departmentsList.forEach(department => {
        getTotalEmployees(`d.id = `, `${department.id}`, `employeeDep`, departmentsList)
    });
        
}


const updateSelectedDepartment = (updateId, location, updateDepartmentValue) => {
    
    let updateLocationId = locationsList.filter(element => element.name === location);
   
    updateLocationId = updateLocationId[0]['id'];
    
    
    if(updateDepartmentValue) {

            
        $.ajax({

            url:'libs/php/updateDepartmentById.php',
            type:'POST',
            dataType: 'json',
            data:{
                id: updateId,
                name: updateDepartmentValue,
                locationID: updateLocationId
            },

            success:(result) => {
                resetInformation('d');
                resetInfoModalContent();
                $(`#editDepartmentModal${updateId}`).modal('hide');
                $('#editDepOrLocModal').empty()
                
                $('#infoModalContent').html(`<h5>Success!</h5>
                     <p>Department ${updateDepartmentValue} updated successfully.</p>`);
                $('#infoModal').modal('show');
                $(`#editDepartmentSubmit${updateId}`).html("Save").attr("disabled", false);

            }, error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
            }
        });
    }
}


const deleteSelectedDepartment = (deleteId, name) => {
    
        $.ajax({

            url:'libs/php/deleteDepartmentByID.php',
            type:'POST',
            dataType: 'json',
            data:{
                id: deleteId,
                name: name
            },
    
            success:(result) => {
                resetInformation('d');
                resetInfoModalContent();
                
                $('#infoModalContent').append(`<h5>Success!</h5><p>${name} deleted successfully.</p>`);
                $('#infoModal').modal('show');
                $('#addDepartmentSubmit').html("Save").attr("disabled", false);
                hasEmployeesToggle = false;
                
            }, error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
            }
        });


   

}


const deleteSelectedLocation = (deleteId, name) => {


    $.ajax({

        url:'libs/php/deleteLocationByID.php',
        type:'POST',
        dataType: 'json',
        data:{
            id: deleteId
        },

        success:(result) => {
            getAllLocations();
            displayLocationCards(locationsList);
            resetInfoModalContent();

            $('#infoModalContent').append(`<h5>Success</h5><br>
                    <p>${name} deleted successfully. </p>`);
            $(`#infoModal`).modal('show');
            hasEmployeesToggle = false;
            
        }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
        }
    });

   
}

// RESET CONTENT - CARDS DIV
const resetInformation = (toggle) => {

    
    if(toggle === 'd') {

        getAllDepartments();
        displayDepartmentCards(departmentsList);
    } else if (toggle === 'l') {

        getAllLocations();
        displayLocationCards(locationsList);
    }

}


const getTotalEmployees = (query, id, elementName, list) => {

    $.ajax({

        url:'libs/php/getTotalEmployeeBy.php',
        type:'POST',
        dataType: 'json',
        data:{
            info : query,
            id: id
        },

        success:(result) => {
            
            list.forEach(department => {
                
                $(`#${elementName}${id}`).html(result.data[0].pc);

            });
        
        }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
         }
    });
}


//////////////////EMPLOYEES FUNCTIONS////////////////////////////////////////

//GET LIST OF THE EMPLOYEES
const getData = () => {

    $.ajax({

        url:'libs/php/getAll.php',
        type:'GET',
        dataType: 'json',
        data:{},

        success:(result) => {

            return result.data

        }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
         }
    });
}




//FUNCTION UPDATES CARDS IN THE CONTAINER
const displayCards = (data) => {


    $('#cards').empty();

    data.forEach(element => {


        let card = `<div class="card" id="${element.id}">
                        <div class="card-header">
							<span class="delete_Btn">
								<i class="fa-solid fa-user-xmark"></i>
							</span>
							<span class="edit_Btn">
								<i class="fa-solid fa-user-pen"></i>
							</span>
                            <div class="name">${element.firstName} ${element.lastName}</div>
                        </div>
                        <div class="card-body">
							<blockquote class="blockquote mb-0">
								<p class="email"><span id="email${element.id}">${element.email}</span></p>
								<p class="jobTitle"><span id="jobTitle${element.id}">${element.jobTitle}</span></p>
								<p class="department"><span id="department${element.id}">${element.department}</span></p>
								<p class="location"><span id="location${element.id}">${element.location}</span></p>
							</blockquote>
                        </div>
                    </div>`;


        $('#cards').append(card);

    });
    
    //EDIT EMPLOYEE BUTTON
    $(`.edit_Btn`).click(function(){

        let editId = $(this).closest('.card').attr('id');
        resetInfoModalContent();
        $(`#edit-employee-modal${editId}`).modal('show');
    });

    //DELETE EMPLOYEE
    $(`.delete_Btn`).click(function(){

        let deleteId = $(this).closest('.card').attr('id');
        let deleteName = $(this).closest('.name').text().trim();

            
        resetInfoModalContent()
        $('.btn-secondary').hide();
        $('#infoModalContent').append(`<p>Are you sure you want to delete this record <span style="font-style: italic;">${deleteName}</span>?</p>`);
        $('#infoModalFooter').append(`<button type="submit" class="btn btn-primary yes" id="yes${deleteId}" >Yes</button>`);
        $('#infoModalFooter').append(`<button type="button" class="btn btn-danger" id="" data-bs-dismiss="modal">No</button>`);
        
        $('#infoModal').modal('show');

        $(`.yes`).on('click', event => {
            deleteEmployee(`${deleteId}`);
        });

    });
}       



//GET LIST OF THE EMPLOYEES
const getEmployeeList = () => {

    $.ajax({

        url:'libs/php/getAll.php',
        type:'GET',
        async: false,
        dataType: 'json',
        data:{},

        success:(result) => {
            console.log(1)
            database = result.data;

            database.forEach(element => {

                let card = `<div class="card" id="${element.id}">
                                <div class="card-header">
									<span class="delete_Btn">
										<i class="fa-solid fa-user-xmark"></i>
									</span>
									<span class="edit_Btn">
										<i class="fa-solid fa-user-pen"></i>
									</span>
                                    <div class="fullName">${element.firstName} ${element.lastName}</div>
                                </div>
                                <div class="card-body">
									<blockquote class="blockquote mb-0">
										<p class="email"><span id="email${element.id}">${element.email}</span></p>
										<p class="jobTitle"><span id="jobTitle${element.id}">${element.jobTitle}</span></p>
										<p class="department"><span id="departmentList${element.id}">${element.department}</span></p>
										<p class="location"><span id="location${element.id}">${element.location}</span></p>
									</blockquote>
                                </div>
                            </div>`      

                $('#cards').append(card);
            
            });     
            displayCardModals();
            console.log(2)

        }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
         }
   
    });
    console.log(3)


    //EDIT EMPLOYEE BUTTON
    $(`.edit_Btn`).click(function(){
        resetInfoModalContent();
        
        let editId = $(this).closest('.card').attr('id');
        $(`#edit-employee-modal${editId}`).modal('show');
    });

    console.log(4)

    
    //DELETE EMPLOYEE
    $('.delete_Btn').click(function(){
        
        let deleteId = $(this).closest('.card').attr('id');
        let deleteName = $(this).closest('.card-header').find("div").first().text();

            
        resetInfoModalContent()
        $('.btn-secondary').hide();
        $('#infoModalContent').append(`<p>Are you sure you want to delete this record <span style="font-style: italic;">${deleteName}</span>?</p>`);
        $('#infoModalFooter').append(`<button type="submit" class="btn btn-primary yes" id="yes${deleteId}" >Yes</button>`);
        $('#infoModalFooter').append(`<button type="button" class="btn btn-danger" id="" data-bs-dismiss="modal">No</button>`);
        
        $('#infoModal').modal('show');

        $(`.yes`).on('click', event => {
            deleteEmployee(`${deleteId}`);
        });

    });

         
}




//EDIT BUTTON BEHAVIOUR
const displayCardModals = () => {
    
    $.ajax({

        url:'libs/php/getAll.php',
        type:'GET',
        dataType: 'json',
        data:{},

        success:(result) => {
            
            let update= result.data;
            update.forEach(element => {


                let edit = `<div class="modal fade" id="edit-employee-modal${element.id}" tabindex="-1" role="dialog" aria-labelledby="editEmployeeModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="editEmployeeModalLabel">Edit Employee</h5>
                                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
        
                                    <form action="/libs/php/updatePersonnelByID.php" method="POST" id="edit-employee">
                                        
                                        <div class="form-group">
                                            <label for="firstName"><i class="red">* </i>Name:</label>
                                            <input type="name" class="form-control" id="editName${element.id}" aria-describedby="" value="${element.firstName}" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="editLastName${element.id}"><i class="red">* </i>Last Name:</label>
                                            <input type="name" class="form-control" id="editLastName${element.id}" aria-describedby="" value="${element.lastName}" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="editEmial${element.id}"><i class="red">* </i>Email:</label>
                                            <input type="email" class="form-control" id="editEmial${element.id}" aria-describedby="" value="${element.email}" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="editjobTitle${element.id}">Job Title:</label>
                                            <input type="text" class="form-control" id="editjobTitle${element.id}" aria-describedby="" value="${element.jobTitle}">
                                        </div>
                                        <div class="form-group">
                                            <label for="department2${element.id}"><i class="red">* </i>Department:</label>
                                            <select class="form-control department" id="departmentEdit${element.id}"></select>
                                        </div>
                                        <div class="form-group">
                                            <label for="location${element.id}">Location:</label>
                                            <select class="form-control location" id="locationEdit${element.id}" disabled></select>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-primary " id="editEmployeeButton${element.id}">Save</button>
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        </div>
                                    </form>
                                   
                                    </div>
                                   
                                </div>
                                </div>
                            </div>`;
        
        
                $('.content').append(edit);
                $(`#locationEdit${element.id}`).append(`<option value="${element.location}">${element.location}</option>`);
                $(`#departmentEdit${element.id}`).empty();
                let currentID = `departmentEdit${element.id}`;
                
                updateDepartments(currentID);

                
                var fetchedDepartment = element.department;
                var mySelect = document.getElementById(`departmentEdit${element.id}`);


                for(var i, j = 0; i = mySelect.options[j]; j++) {
                    
                    if(i.text == fetchedDepartment) {
                        mySelect.selectedIndex = j;
                        break;
                    }
                }
                
        
                $(`#editEmployeeButton${element.id}`).on('click', function() {
                    resetInfoModalContent();
                    $(`#editEmployeeButton${element.id}`).html(`<span class="spinner-border spinner-border-sm text-light"></span><span>Loading</span>`)
                                    .attr("disabled", true);

                   

                    for(let i = 0; i < departments.length; i++) {
        
                        departOption = `<option value="${departments[i]}">${departments[i]}</option>`;
                        $(`#departmentEdit${element.id}`).append(departOption);
                    }
        
            
        
                    for(let i = 0; i < locations.length; i++) {
        
                        locOption = `<option value="${locations[i]}">${locations[i]}</option>`
                        $(`#locationEdit${element.id}`).append(locOption);
        
                    } 
        
                    let editName = document.getElementById(`editName${element.id}`).value;
                    let editlastName = document.getElementById(`editLastName${element.id}`).value;
                    let editEmail = document.getElementById(`editEmial${element.id}`).value;
                    let editjobTitle =document.getElementById(`editjobTitle${element.id}`).value; 
                    let editDepartment = document.getElementById(`departmentEdit${element.id}`).value;
        
        
                    $(`#departmentEdit${element.id}`).change(function() {
                        editDepartment = $(this).find('option:selected').data('text');
                    });
        
                    $(`#departmentEdit${element.id}`).on('change', event => {
                        $(`#locationEdit${element.id}`).css("value", element.location)
                    })
        
                    /*
                    let editDepartmentsID = departmentsList.find(element => {
                        if (element.name === editDepartment) {
                          return element.id;
                        }
                      
                        return false;
                      });
                    
                    editDepartmentsID = editDepartmentsID['id'];
                      */
                    updateEmployee(`${element.id}`, editName, editlastName, editEmail, editjobTitle, editDepartment);
        
                });
            });
            
        
        }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
         }
    });

    
}



//////////////////////////////////SORT///////////////////////////////////////////////////

//SORT EVENT HANDLERS
$('#sortLastName').on('click', event => { 
    sortBy = 'lastName';
    sortResults(sortBy);
});


$('#sortFirstName').on('click', event => {
    sortBy = 'firstName';
    sortResults(sortBy);
});

$('#sortdepartment').on('click', event => {
    sortBy = 'department';
    sortResults(sortBy);
});

$('#sortlocation').on('click', event => {
    sortBy = 'location';
    sortResults(sortBy);
});

$('#sortID').on('click', event => {
    sortBy = 'id';
    sortResults(sortBy);
});

$('#sortEmail').on('click', event => {
    sortBy = 'email';
    sortResults(sortBy);
});


//SORT RESULTS BY
const sortResults = (sortBy) => {

    let data = sortBy;
    let sortedData = [];

    $.ajax({

        url:'libs/php/sortBy.php',
        type:'POST',
        dataType: 'json',
        data:{
            sortBy : data,
        },

        success:(result) => {

            sortedData = result['data']['personnel'];
            displayCards(sortedData);

            $('#buttons').css("height", "30px");
            $('#backBtn').slideDown("fast", "swing");   
		
        }, error: function(jqXHR, errorThrown) {
            console.log(jqXHR, errorThrown)
        }
    }); 
}

 


///////////////////////////////////////    HELPER FUNCTIONS     /////////////////////////////////////////////////
//GET DEPARTMENTS

const getAllDepartments = () => {

    $.ajax({

        url: "libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',
        data: {},

        success: function(results) {

            departments = [];
            departmentsList = [];

            //departmentsList.length = 0
        
            results['data'].forEach(element => {
                //departments.push(element.name);
                departmentsList.push(element);
            });

        }, error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
         }
    });

}

 

//UPDATE DEPARTMENTS
const updateDepartments = (id) => {
    
    for(let i = 0; i < departmentsList.length; i++) {
        departOption = `<option value="${departmentsList[i].id}">${departmentsList[i].name}</option>`
        $(`#${id}`).append(departOption);
    }   

}

 

//GET LOCATIONS
const getAllLocations = () => {

    $.ajax({

        url: "libs/php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',
        data: {},

        success: function(results) {

            locations = [];
            locationsList = [];
            //locationsList.length = 0


            results['data'].forEach(element => {
                //locations.push(element.name);
                locationsList.push(element);
            });

        }, error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    });

} 


//UPDATE LOCATIONS
const updateLocations = (id) => {

    let locOption;

    for(let i = 0; i < locationsList.length; i++) {
        locOption = `<option value="${locationsList[i].id}">${locationsList[i].name}</option>`
        $(`${id}`).append(locOption);
    } 

}


//DELETE EMPLOYEE FUNCTION
const deleteEmployee = (employeeAccount) => {


        $.ajax({
            url: 'libs/php/deletePersonnelByID.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id: employeeAccount
            },

            success: function(result) {
                resetInfoModalContent()
                $('#cards').empty();
                
                $('#infoModalContent').append(`Account succeessfully deleted.`);
                $('#infoModal').modal('show');
                getEmployeeList();

            }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });
      
}


//EDIT EMPLOYEE FUNCTION
const updateEmployee = (employeeAccount, editName, editlastName, editEmail, editjobTitle, editDepartment) => {


            $.ajax({

                url: 'libs/php/updatePersonnelByID.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: employeeAccount,
                    firstName: editName, 
                    lastName: editlastName, 
                    email: editEmail, 
                    jobTitle: editjobTitle,
                    department: editDepartment
                },

                success: function(result) {
                    resetInfoModalContent()
                    $(`#edit-employee-modal${employeeAccount}`).modal('hide');
                    $('#cards').empty();
                    
                    $('#infoModalContent').html(`<h5>Success!</h5><br>
                        <p>Account succeessfully updated.</p>`);
                    $('#infoModal').modal('show');
                    getEmployeeList();
                

                }, error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                }
            });
}


///GO BACK EVENT HANDLER
$('#backBtn').on('click', event => {

    $('#cards').empty();
    getEmployeeList();
    $('#buttons').css("height", "0px");
    $('#backBtn').slideToggle("slow", "swing");

});

 

//RESET UNIVERSAL MODAL CONTENT
const resetInfoModalContent = () => {

    $('#infoModalContent').empty();
    $(".btn-danger").remove();
    $(".yes").remove();
    $('.btn-secondary').show();
   
}

$(document).ready(function(){

    getAllDepartments();
    getAllLocations();
    getEmployeeList();  

    /* PRELOADER */
    if ($('#preloader').length) {
        $('#preloader').delay(300).fadeOut('slow', function () {
        $(this).remove();
    });
    }

});