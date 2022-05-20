/* PRELOADER */

$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(50).fadeOut('slow', function () {
        $(this).remove();
    });
}});


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
let depsID = [];
let locsID = [];
let departmentsList = [];
let locationsList = [];

 
/* FUNCTIONS */


//SEARCH

$('#search-addon').on('click', event => {

    var searchTerm = $('#search_box').val().toLowerCase();


    if(searchTerm){

        //--------------
        $.ajax({
            url:'libs/php/search.php',
            type:'POST',
            dataType: 'json',
            data:{
                searchTerm : searchTerm
            },

            success:(result) => {
                //console.log(result);
                let data = result['data']['personnel'];
                displayCards(data);
				//displayCardModals(data);


                $('#buttons').css("height", "30px");
                $('#backBtn').slideDown("fast", "swing");   

            }, error: function(errorThrown) {
                console.log(errorThrown);
            }
        });
    }

    $('#search_box').val("");

});

 

// ADD NEW EMPLOYEE

$('#plus-person-addon').on('click', event => {

    $('#add-employee-modal').modal('show');

    $('#addEmployeeButton').on('click', event =>  {

		let addName = document. getElementById("firstName").value;
		let addSurname = document. getElementById("lastName").value;
		let addEmail = document. getElementById("email").value;
		let addJobTitle = document. getElementById("jobTitle").value;
		let addDepartment = document. getElementById("department").value; 
	
		$('#department').change(function() {
			addDepartment = $(this).find('option:selected').data('value');
		});

		
		let departmentsID = departmentsList.find(element => {
			if (element.name === addDepartment) {
			  return element.id;
			}
		  
			return false;
		  });
		  departmentsID = departmentsID['id'];

		//departmentsID = departments.indexOf(addDepartment) + 1;

        $('#addEmployeeButton').html(`<span class="spinner-border spinner-border-sm text-light" style=""></span> <span>Loading</span>`)
                                .attr("disabled", true);

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
                department: departmentsID
            },

            success:(result) => {

                $('#add-employee-modal').modal('hide');
                alert(`Employee ${addName} ${addSurname} successfully added.`)
                location.reload();

            }, error: function(errorThrown) {
                $('#add-employee-modal').modal('hide');
                alert('Error, please fill in all required fields.');
            }
        });

    });

});

 

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


        let card = `<div class="card" id="employee${element.id}">
                        <div class="card-header">
                        ${element.firstName}  ${element.lastName} 
							<span class="delete-employee" id="delete-employee${element.id}">
								<i class="fa-solid fa-user-xmark"></i>
							</span>
							<span class="edit-employee" id="edit-employee${element.id}">
								<i class="fa-solid fa-user-pen"></i>
							</span>
                        </div>
                        <div class="card-body">
							<blockquote class="blockquote mb-0">
								<p class="email">Email: <span id="email${element.id}">${element.email}</span></p>
								<p class="jobTitle">Job Title: <span id="jobTitle${element.id}">${element.jobTitle}</span></p>
								<p class="department">Department: <span id="department${element.id}">${element.department}</span></p>
								<p class="location">Location: <span id="location${element.id}">${element.location}</span></p>
							</blockquote>
                        </div>
                    </div>`;


        $('#cards').append(card);

        //EDIT EMPLOYEE BUTTON
        $(`#edit-employee${element.id}`).on('click', event => {
            $(`#edit-employee-modal${element.id}`).modal('show');
        });

        //DELETE EMPLOYEE
        $(`#delete-employee${element.id}`).on('click', event => {
            let delete_employee = confirm("Are you sure you want to delete this record?");
            deleteEmployee(`${element.id}`, delete_employee);
        });

    });
}       



//GET LIST OF THE EMPLOYEES
const getEmployeeList = () => {

    $.ajax({

        url:'libs/php/getAll.php',
        type:'GET',
        dataType: 'json',
        data:{},

        success:(result) => {

            database = result.data;

            database.forEach(element => {

                let card = `<div class="card" id="employee${element.id}">
                                <div class="card-header">
                                ${element.firstName}  ${element.lastName} 
									<span class="delete-employee" id="delete-employee${element.id}">
										<i class="fa-solid fa-user-xmark"></i>
									</span>
									<span class="edit-employee" id="edit-employee${element.id}">
										<i class="fa-solid fa-user-pen"></i>
									</span>
                                </div>
                                <div class="card-body">
									<blockquote class="blockquote mb-0">
										<p class="email">Email: <span id="email${element.id}">${element.email}</span></p>
										<p class="jobTitle">Job Title: <span id="jobTitle${element.id}">${element.jobTitle}</span></p>
										<p class="department">Department: <span id="departmentList${element.id}">${element.department}</span></p>
										<p class="location">Location: <span id="location${element.id}">${element.location}</span></p>
									</blockquote>
                                </div>
                            </div>`      

                $('#cards').append(card);

                //EDIT EMPLOYEE BUTTON
                $(`#edit-employee${element.id}`).on('click', event => {
                    $(`#edit-employee-modal${element.id}`).modal('show');
                });

                //DELETE EMPLOYEE

                $(`#delete-employee${element.id}`).on('click', event => {
                    let delete_employee = confirm("Are you sure you want to delete this record?");
                    deleteEmployee(`${element.id}`, delete_employee);
                });
            });

            //ADD AND DELETE DEPARTMENT             
            $('#addDepartmentBtn').on('click', event => {

                $('#departmentModalBody').empty();
                $('#departmentModalBody').append(
                    `<tr>
                        <th scope="row">Enter department name:</th>
                    </tr>
                    <tr>
                        <th scope="row">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" id="newDepartment" aria-label="Default" aria-describedby="inputGroup-sizing-default">
                        </div>
                        </th>
                    </tr>
                    <tr>
                        <th scope="row">Select location:</th>
                    </tr>
                    <tr>
                        <th scope="row">
                            <select id="locationNewDepartment" class="location"></select>
                        </th>
                    </tr>`
                );

                for(let i = 0; i < locations.length; i++) {
                    locOption = `<option value="${locations[i]}">${locations[i]}</option>`
                    $(`#locationNewDepartment`).append(locOption);
                }                               

                $('#addDepartmentSubmit').on('click', event => {

                    let newDepartment =  document.getElementById('newDepartment').value;
                    let locationNewDepartment = document.getElementById("locationNewDepartment").value;
                
                    $('#locationNewDepartment').click(function() {
                        locationNewDepartment = $(this).find('option:selected').data('value');
                    });

					let newDepartmentLocID = locationsList.find(element => {
						if (element.name === locationNewDepartment) {
						  return element.id;
						}
					  
						return false;
					  });

					newDepartmentLocID = newDepartmentLocID['id'];

                    $('#addDepartmentSubmit').html(`<span class="spinner-border spinner-border-sm text-light" style=""></span> <span>Loading</span>`)
                               .attr("disabled", true);

                    $.ajax({

                        url:'libs/php/insertDepartment.php',
                        type:'POST',
                        dataType: 'json',
                        data:{
                            name : newDepartment,
                            locationID : newDepartmentLocID
                        },

                        success:(result) => {

                            alert(`${newDepartment} added successfully.`)
                            location.reload();

                        }, error: function(jqXHR, textStatus, errorThrown) {
                                console.log(jqXHR, textStatus, errorThrown);
                        }
                    });
                });
            })


            $('#deleteDepartmentBtn').on('click', event => {

                $('#departmentModalBody').empty();
                $('#departmentModalBody').append(
                    `<tr>
                        <th scope="row">Select department name:</th>
                    </tr>
                    <tr>
                        <th scope="row">
                            <select class="" id="deleteDepartment"></select>
                        </th>
                    </tr>`
                );

                //updateDepartments('deleteDepartment');

				
				$('#addDepartmentSubmit').on('click', event => {

					let deleteDepartment = document.getElementById('deleteDepartment').value;
					let deleteDepartmentID = departmentsList.find(element => {
						if (element.name === deleteDepartment) {
						  return element.id;
						}
					  
						return false;
					  });;
					deleteDepartmentID = deleteDepartmentID['id'];

                    $('#addDepartmentSubmit').html(`<span class="spinner-border spinner-border-sm text-light" style=""></span> <span>Loading</span>`)
                               .attr("disabled", true);

                    $.ajax({

                        url:'libs/php/deleteDepartmentByID.php',
                        type:'POST',
                        dataType: 'json',
                        data:{
                            id: deleteDepartmentID
                        },

                        success:(result) => {
							
                            alert(`${deleteDepartment} deleted successfully.`)
                            location.reload();

                        }, error: function(jqXHR, textStatus, errorThrown) {
                                console.log(jqXHR, textStatus, errorThrown);
                        }
                    });
                });
            })

 

            //ADD AND DELETE LOCATION               
            $('#addLocationBtn').on('click', event => {

                $('#locationModalBody').empty();
                $('#locationModalBody').append(
                    `<tr>
                        <th scope="row">Enter location:</th>
                    </tr>
                    <tr>
                        <th scope="row">
							<div class="input-group mb-3">
								<input type="text" id="newLocation" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
							</div>
                        </th>
                    </tr>`
                );


                $('#addLocationSubmit').on('click', event => {

                    let newLocation = document.getElementById('newLocation').value;
                    //console.log(newLocation);

                    $('#addLocationSubmit').html(`<span class="spinner-border spinner-border-sm text-light" style=""></span> <span>Loading</span>`)
                               .attr("disabled", true);

                    $.ajax({

                        url:'libs/php/insertLocation.php',
                        type:'POST',
                        dataType: 'json',
                        data:{
                            name : newLocation
                        },

                        success:(result) => {

                            alert(`${newLocation} added successfully.`)
                            location.reload();

                        }, error: function(jqXHR, textStatus, errorThrown) {
                                console.log(jqXHR, textStatus, errorThrown);
                        }
                    });
                });

            })


            $('#deleteLocationBtn').on('click', event => {

                $('#locationModalBody').empty();
                $('#locationModalBody').append(
                    `<tr>
                        <th scope="row">Select location name:</th>
                    </tr>
                    <tr>
                        <th scope="row">
                            <select class="" id="deleteLocation"></select>
                        </th>
                    </tr>`
                );

                for(let i = 0; i < locations.length; i++) {
                    locOption = `<option value="${locations[i]}">${locations[i]}</option>`
                    $(`#deleteLocation`).append(locOption);
                }

                $('#addLocationSubmit').on('click', event => {
                    
					let deleteLocation = document.getElementById('deleteLocation').value;
					let deleteLocationId = locationsList.find(element => {
						if (element.name === deleteLocation) {
						  return element.id;
						}
					  
						return false;
					  });
					//console.log(deleteLocationId)
					deleteLocationId = deleteLocationId['id'];

                    $('#addLocationSubmit').html(`<span class="spinner-border spinner-border-sm text-light" style=""></span> <span>Loading</span>`)
                               .attr("disabled", true);


                    $.ajax({

                        url:'libs/php/deleteLocationByID.php',
                        type:'POST',
                        dataType: 'json',
                        data:{
                            id: deleteLocationId
                        },

                        success:(result) => {

                            alert(`${deleteLocation} deleted successfully.`)
                            location.reload();

                        }, error: function(jqXHR, textStatus, errorThrown) {
                                console.log(jqXHR, textStatus, errorThrown);
                        }
                    });
                })
            })

            displayCardModals(result.data);

            updateDepartments(`department`);   

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


//EDIT BUTTON BEHAVIOUR
const displayCardModals = (v) => {
    

    v.forEach(element => {


        let edit = `<div class="modal fade" id="edit-employee-modal${element.id}" tabindex="-1" role="dialog" aria-labelledby="editEmployeeModalLabel${element.id}" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
								<h5 class="modal-title" id="editEmployeeModalLabel${element.id}">Edit Existing Employee</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
                            </div>
                            <div class="modal-body">

                            <table class="table">
                                <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>ID:</td>
                                    <td><input type="text" required disabled value="${element.id}" id="editId${element.id}" ></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>First Name:</td>
                                    <td><input type="text" required value="${element.firstName}" id="editName${element.id}"></td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Surname:</td>
                                    <td><input type="text" value="${element.lastName}" required id="editLastName${element.id}"></td>
                                </tr>
                                <tr>
									<th scope="row">4</th>
									<td>Email:</td>
									<td><input type="text" value="${element.email}" required id="editEmial${element.id}"></td>
                                </tr>
                                <tr>
                                    <th scope="row">5</th>
                                    <td><label for="jobTitlen${element.id}">Job Title:</label></td>
                                    <td><input type="text" value="${element.jobTitle}" id="editjobTitle${element.id}" required></td>
                                </tr>
                                <tr>
                                    <th scope="row">6</th>
										<td>
										<label for="department2${element.id}">Department:</label>
										</td>
                                    <td>
                                   		<select class="department" id="departmentEdit${element.id}" ></select>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">7</th>
										<td>
										<label for="location${element.id}">Location:</label>
										</td>
                                    <td>
                                  	  <select id="locationEdit${element.id}" class="location" disabled></select>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary " id="editEmployeeButton${element.id}">Save</button>
                            </div>
                        </div>
                        </div>
                    </div>`;


        $('.content').append(edit);
        $(`#locationEdit${element.id}`).append(`<option value="${element.location}">${element.location}</option>`);
        let currentID = `departmentEdit${element.id}`;

        updateDepartments(currentID);

        var fetchedDepartment = element.department;
        var mySelect = document.getElementById(`departmentEdit${element.id}`);
 

        for(var i, j = 0; i = mySelect.options[j]; j++) {
            if(i.value == fetchedDepartment) {
                mySelect.selectedIndex = j;
                break;
            }
        }

        $(`#editEmployeeButton${element.id}`).on('click', function() {

            for(let i = 0; i < departments.length; i++) {
                departOption = `<option value="${departments[i]}">${departments[i]}</option>`;
                $(`#departmentEdit${element.id}`).append(departOption);
            }

    

            for(let i = 0; i < locations.length; i++) {

                locOption = `<option value="${locations[i]}">${locations[i]}</option>`
                $(`#locationEdit${element.id}`).append(locOption);

            } 


            $(`#editEmployeeButton${element.id}`).html(`<span class="spinner-border spinner-border-sm text-light" style=""></span> <span>Loading</span>`)
                            .attr("disabled", true);


            let editName = document.getElementById(`editName${element.id}`).value;
            let editlastName = document.getElementById(`editLastName${element.id}`).value;
            let editEmail = document.getElementById(`editEmial${element.id}`).value;
            let editjobTitle =document.getElementById(`editjobTitle${element.id}`).value; 
            let editDepartment = document.getElementById(`departmentEdit${element.id}`).value;


            $(`#departmentEdit${element.id}`).change(function() {
                editDepartment = $(this).find('option:selected').data('value');
            });

            $(`#departmentEdit${element.id}`).on('change', event => {
                $(`#locationEdit${element.id}`).css("value", element.location)
            })

			
			let editDepartmentsID = departmentsList.find(element => {
				if (element.name === editDepartment) {
				  return element.id;
				}
			  
				return false;
			  });
			//console.log(deleteLocationId)
			editDepartmentsID = editDepartmentsID['id'];
            //editDepartmentsID = departments.indexOf(editDepartment) + 1;
            //let editDepertmentid = depsID[editDepartmentsID - 1]

            updateEmployee(`${element.id}`, editName, editlastName, editEmail, editjobTitle, editDepartmentsID);

        });
    });
}

 

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
			//displayCardModals(sortedData);
            //console.log(sortedData)

            $('#buttons').css("height", "30px");
            $('#backBtn').slideDown("fast", "swing");   
			/*
            */
			

        }, error: function(jqXHR, errorThrown) {
            console.log(jqXHR, errorThrown)
        }
    }); 
}

 

//GET DEPARTMENTS

const getAllDepartments = () => {

    $.ajax({

        url: "libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',
        data: {},

        success: function(results) {

            results['data'].forEach(element => {
                departments.push(element.name);
                depsID.push(element.id);
                departmentsList.push(element);
            });

        }, error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
         }
    });
}

 

//UPDATE DEPARTMENTS
const updateDepartments = (id) => {

    for(let i = 0; i < departments.length; i++) {
        departOption = `<option value="${departments[i]}">${departments[i]}</option>`
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

            results['data'].forEach(element => {
                locations.push(element.name);
                locsID.push(element.id);
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

    for(let i = 0; i < locations.length; i++) {
        locOption = `<option value="${locations[i]}">${locations[i]}</option>`
        $(`${id}`).append(locOption);
    } 

}


//DELETE EMPLOYEE FUNCTION
const deleteEmployee = (employeeAccount, delete_employee) => {


    if(delete_employee) {

        $.ajax({
            url: 'libs/php/deletePersonnelByID.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id: employeeAccount
            },

            success: function(result) {

                alert('Account succeessfully deleted.')
                location.reload();

            }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });
    }   
}


//EDIT EMPLOYEE FUNCTION
const updateEmployee = (employeeAccount, editName, editlastName, editEmail, editjobTitle, editDepartment) => {

    console.log(editName, editlastName, editEmail);

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

                    alert('Account succeessfully updated.');
                    location.reload();

                }, error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                }
            });
}
 

$(document).ready(function(){

    getAllDepartments();
    getAllLocations();
    getEmployeeList();  
    getData();

});