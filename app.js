// test code change
//gas project /apps/brookers/system 
//This global variable is set to contain the information needed to make a request of the Google App Script server.
const gas_end_point = 'https://script.google.com/macros/s/'+gas_deployment_id()+'/exec'

//This global variable defines the first two navigation items in the menu. In this app there are only two main navigation items "Home" and "Locations". These two menu items are visible regardless of login status.  
const nav_menu=[
    //Note that a menu item is added by inserting an object for that menu item. The 'label' is the text that the user sees for that menu option. The function is the javascript function invoked when selecting that option. Here we insert the "home" and "locations" menu items. Both initiate a call to the navigate function which loads the appropriate page. The navigate function is used to help ensure smooth navigation. It allows the user to use the back botton in their browser when navigating between pages on the site (without navigating out ot the site). The navigate can accept parameters that can be passed to the function called by navigate.
    {label:"Home",function:"navigate({fn:'show_home'})"},
    {label:"Locations",function:"navigate({fn:'show_locations'})"},
    
]

//This global variable sets the menu items for an unautheticated user.  
const unauthenticated_menu=[
    //The unautheticated user is presented with the "Home" and "Locations" (defined in the nav_menu global variable).
    {menu:nav_menu},
    //this empty object inserts a horizontal line in the navigation menu panel
    {},
    //The unauthenticated user is also presented with the "Login" and "Recover password" menu options.
    {label:"Login",function:"login()",home:"Login",panel:"login_panel"},
    {label:"Recover Password",function:"recover_password()",panel:"recover"}, 
]

//This global variable sets the menu items for an autheticated user.  
const authenticated_menu=[
    //The autheticated user is presented with the "Home" and "Locations" (defined in the nav_menu global variable).
    {menu:nav_menu},
    //this empty object inserts a horizontal line in the navigation menu panel
    {},
    //The authenticated user is also presented with additional menu options.
    //The first item loads the user's name (get_user_name) which is the label for a top-level menu which is built for the user functions
    {label:get_user_name,id:"user-menu", menu:[
        //the user functions include the ability to change their password and edit their personal data
        {label:"Change Password",function:"change_password()",panel: "password_panel"},
        {label:"Personal Data",function:"navigate({fn:'personal_data'})"},
    ]},
    //This menu item allows the user to logout
    {label:"Logout",function:"logout()", home:"Logout"},
    
    //This menu item allows the user to add additional users. Note the "roles" property of the object. Only users with the role of "manager", "owner", or "administrator" will see this menu item. User roles are not heirachical. All user types you wish to see a menu item must be listed in the elements of the array.
    {label:"Add Employee",function:"navigate({fn:'create_account'})", roles:["manager","owner","administrator"]}, 

    {label:"Task List",function:"navigate({fn:'show_task_list'})"},
    {label:"Employee List",function:"navigate({fn:'employee_list'})"},
    {
        label: "Admin Tools", id: "menu2", roles: ["manager", "owner", "administrator"], menu:[
        { label: "Update User", function: "update_user()", panel: "update_user" },
            { label: "Student Information", function: "navigate({fn:'admin_data'})", roles: ["manager", "owner", "administrator"] },
    ]
    },
    {
        label: "Student Tools", id: "menu2", roles: ["student"], menu: [
        ]
    },
    {
        label: "Preceptor Tools", id: "menu2", roles: ["preceptor"], menu: [
        ]
    }

]


function show_home(){
    
    //builds the menu for the home screen
    const menu=[]
    //current_menu is a global variable that is built based on the set of menu items defined for users and their roles. 
    for(item of current_menu){
        if(item.home){
            menu.push(`<a onClick="${item.function}">${item.home}</a>`)
        }
    }

    //the main page is rendered with the Brooker's Ice cream logo. 

    tag("canvas").innerHTML=` 
    <div class="center-screen">
    
    <p><img height="${window.innerHeight * .6}" src="https://iconape.com/wp-content/files/zu/190423/png/utah-valley-university-uvu-logo.png"></p>
    <div style="text-align:center"></div>
    
    
    </div>
    `

    //The navigation menu is hidden (the three parallel lines are show) when the homepage is rendered.
    hide_menu()
}

function get_user_name(){
    //returns the user's first and last name. Used when building the navigation menu to be the label for the menu items related to maintaining the user. The get_user_data function reads the user information from the data cookie that is created when the user logs in.
    data=get_user_data()
    return data.first_name + " " + data.last_name
}

async function show_locations(){
    //This function demonstrates how to render a view that is created in Airtable. The list of locations is a view of the Store table in airtable. It is shared in Airtable. The ID of the share is all that is needed to display the share embedded in this webpage. Generally Airtable shared items are visible by anyone with the link or id, so any data that must be secured should not be rendered using this method. However, it is a quick and easy way to display data stored in airtable.
    const airtable_object_id="shrwz1d1aExJUIbUo"
    const width = 400
    //here the HTML of the page is configured to display the shared view in airtable.
    tag("canvas").innerHTML=`<div class="center-screen"><iframe class="airtable-embed" src="https://airtable.com/embed/${airtable_object_id}?backgroundColor=cyan" frameborder="0" onmousewheel="" width="${width}" height="500" style="background-color: white; border: 1px solid #ccc;"></iframe></div>`
    hide_menu()
}
async function show_rotations(){
    //This function demonstrates how to render a view that is created in Airtable. The list of locations is a view of the Store table in airtable. It is shared in Airtable. The ID of the share is all that is needed to display the share embedded in this webpage. Generally Airtable shared items are visible by anyone with the link or id, so any data that must be secured should not be rendered using this method. However, it is a quick and easy way to display data stored in airtable.
    const airtable_object_id="shrwz1d1aExJUIbUo"
    const width = 400
    //here the HTML of the page is configured to display the shared view in airtable.
    tag("canvas").innerHTML=`<div class="center-screen"><iframe class="airtable-embed" src="https://airtable.com/embed/${airtable_object_id}?backgroundColor=cyan" frameborder="0" onmousewheel="" width="${width}" height="500" style="background-color: white; border: 1px solid #ccc;"></iframe></div>`
    hide_menu()
}

function hide_elements(className){// adds the hidden class to all elements of the given class name
    if(Array.isArray(className)){
        var classes=className
    }else{
        var classes=[className]
    }

    for(const one_class of classes){
        for(const elem of document.getElementsByClassName(one_class)){
            elem.classList.add("hidden")
        }
    }
}

function show_elements(className){// remvoes the hidden class to all elements of the given class name
    if(Array.isArray(className)){
        var classes=className
    }else{
        var classes=[className]
    }
    
    for(const one_class of classes){
        for(const elem of document.getElementsByClassName(one_class)){
            elem.classList.remove("hidden")
        }
    }
}

async function employee_list(){
    //this function displays an employee list. If the user role allows, the option to update the user record in Google App Script is presented
    //Note: user information is stored in Airtable. However, to avoid the need to repeatedly access Airtable to retrieve user information, a record is stored in Google App Script. This record must be updated when changes are made to user information in Airtable, thus the need for user information to be updated.
    if(!logged_in()){show_home();return}//in case followed a link after logging out
    hide_menu()
    //Build the HTML placeholders for the employee data.
    tag("canvas").innerHTML=` 
    <div class="page">
        <h2>Employee List</h2>
        <div id="member-list-message" style="padding-top:1rem;margin-bottom:1rem">
        Employee information is private and should not be shared.
        </div>
        <div id="employee_list_panel">
        <i class="fas fa-spinner fa-pulse"></i>
        </div>
    </div>
    `
    
    //retrieve the employee data using the local post_data function to request the Google App Script function "employee_list" retrieve the employee data.
    const response=await post_data({
        mode:"employee_list",
        filter:""
    })

    //build the standard headers for the employee table
    const labels={
        first_name:"First Name",
        last_name:"Last Name",
        email:"Email",
        phone:"Phone",
    }

    //determine if the user has a role that allows for employee updates.
    const is_admin=intersect(get_user_data().roles, ["administrator","owner","manager"]).length>0

    if(response.status==="success"){
        const html=['<table style="background-color:white"><tr>']
        //add the standard headers to the table
        for(const field of response.fields){
            html.push("<th>")
            html.push(labels[field])
            html.push("</th>")
        }
        //If the role is sufficient to perform employee updates, add the header "Action"
        if(is_admin){html.push("<th>Action</th>")}
        html.push("</tr>")

        //process through the employee records that were returned and add them to the table.
        for(const record of response.records){
            html.push("<tr>")
            console.log(record)
            for(const field of response.fields){
                if(record.fields[field]==="withheld"){
                  html.push('<td style="color:lightgray">')
                }else{
                  html.push("<td>")
                }
                html.push(record.fields[field])
                html.push("</td>")
            }
            //If the user is able to perform employee updates, add a button that allows them update employees
            if(is_admin){
                html.push("<td>")
                    html.push(`<a class="tools" onclick="update_user({email:'${record.fields.email}', button:'Update User', mode:'update_user'},tag('member-list-message'))">Update</a>`)
                html.push("</td>")
            }
            html.push("</tr>")
        }
        html.push("</table>")
    
        tag("employee_list_panel").innerHTML=html.join("")
    
    }else{
        tag("employee_list_panel").innerHTML="Unable to get member list: " + response.message + "."
    }    

}

function isChecked(checkbox, sub1) {
    document.getElementById(sub1).disabled = !checkbox.checked;
}

async function show_task_list(){
    if(!logged_in()){show_home();return}//in case followed a link after logging out. This prevents the user from using this feature when they are not authenticated.
    
        //First we hide the menu
        hide_menu()
        console.log('at show_task_list.')
        
        //building the HTML shell
        tag("canvas").innerHTML=`
            <div class="page">
            <section>
                <button class="button" onclick="buttonClicked()">Home</button>
                <button class="button">Calendar</button>
                <button class="button">Requirements</button>
            </section>
                <div id="task-title" style="text-align:center"><h2>Student Progress</h2></div>
                <div id="task-title" style="text-align:center">
                    <div class="user">
                        <div value = "get_user_name">Student Info </div>
                        <div>Current Rotation: </div>
                    </div>
                <div id="task-message" style="width:100%"></div>
                <div id="task_panel" style="width:100%"></div>
                
            </div>
            `
        //get the data from airtable through google apps script
        const params = {mode: "get_task_list",filter: ""}
        console.log('params',params)
        
        let response=await post_data(params)
        console.log('response',response)
        
        //Build the table to display the report. The columns of the table are: Flavor, the stores available to the user, and the total inventory. Since only the owner is given the option to view inventory counts (see the autheticated_user global variable), all stores will be shown in the report.
        const header=[`
            <table>
            <tr>
            <th>Learning Outcome</th>`]
     
        header.push(`<th>Completed</th>`)
        header.push(`<th>Change</th>`)
        header.push('<th> </th>')
        header.push('<th>')
        header.push("</tr>")
        const html=[header.join("")]
        
        for(record of response.task_list){
        //add a new table row to the table for each task
        html.push("<tr>")
        //insert the task description
        html.push(`<td>${record.fields.Name}</td>`)
        //Insert the status of the task
        html.push(`<td align='center'>${record.fields.Completed}</td>`)
        if(record.fields.Completed==='No'){
        html.push(`<td><a class="tools" onclick="mark_task_complete({id:'${record.id}', name:'${record.fields.Name}'})">Mark as Completed</a></td>`)
        }
        html.push(`<td align='center'>${record.fields.Done}</td>`)
        html.push("</tr>")
        }
        
        html.push("</table>")
        tag("task_panel").innerHTML=html.join("")
    
    }
    
    async function mark_task_complete(params){
        console.log('in mark_task_complete')
        payload = {mode:"mark_task_complete", id:params.id, name:params.name}
        const response=await post_data(payload)
        show_task_list()
        
}

async function show_student_rotation() {
    if (!logged_in()) { show_home(); return }//in case followed a link after logging out. This prevents the user from using this feature when they are not authenticated.

    //First we hide the menu
    hide_menu()
    console.log('at show_student_rotation.')

    //building the HTML shell
    tag("canvas").innerHTML = `
    <div class="page">
    <div id="task-title" style="text-align:center"><h2>Show Rotations</h2></div>
    <div id="task-message" style="width:100%"></div>
    <div id="rotation_panel" style="width:100%">
    </div>
    </div>
    `
    //get the data from airtable through google apps script
    const params = { mode: "get_student_rotation", filter: "" }
    console.log('params', params)

    let response = await post_data(params)
    console.log('response', response)

    //Build the table to display the report. The columns of the table are: Flavor, the stores available to the user, and the total inventory. Since only the owner is given the option to view inventory counts (see the autheticated_user global variable), all stores will be shown in the report.
    const header = [`
    <table>
    <tr>
    <th>Rotations</th>
    `]
    header.push(`<th>Rotation</th>`)
    header.push(`<th>Change</th>`)
    header.push("</tr>")
    const html = [header.join("")]

    for (record of response.student_rotation) {
        //add a new table row to the table for each flavor
        html.push("<tr>")
        //insert the task description
        html.push(`<td>${record.fields.Name}</td>`)
        //Insert the status of the task
        html.push(`<td align='center'>${record.fields.Specialities}</td>`)
        if (record.fields.Completed === 'No') {
            html.push(`<td><a class="tools" onclick="mark_rotation_complete({id:'${record.id}', name:'${record.fields.Name}'})">Mark as Completed</a></td>`)
        }
        html.push("</tr>")
    }

    html.push("</table>")
    tag("rotation_panel").innerHTML = html.join("")

}

async function mark_rotation_complete(params) {
    console.log('in mark_task_complete')
    payload = { mode: "mark_task_complete", id: params.id, name: params.name }
    const response = await post_data(payload)
    show_student_rotation()
}

async function admin_data(params) {
    hide_menu()
    const panel = tag("view_admin_panel")

    if (!params) {
        tag("canvas").innerHTML = ` 
        <div class="page">
            <h2>Please Search For The Student That You Would Like To View.</h2>
        <div id="form">
            <form>
                First Name: <input placeholder="Name" name="first_name" value="">
                Last Name: <input placeholder="Name" name="last_name" value="">
                Student ID: <input placeholder="ID" name="id" value="">
                <input type="hidden" name="mode" value="get_student_data">
                <button id="get_student_button" type="button" onclick="admin_data(form_data(this,true))">Search</button>
            </form>
        </div>
        <div id="task-message" style="width:100%"></div>
        <div id="rotation_panel" style="width:100%"></div>
        <div id="admin_panel" style="width:100%"></div>
        </div>
        `
        
    } else if (params.button) {
        if (params.button === 'Search') {
            let response = await post_data(params)
            console.log("student data", response.student_data[0])
            payload = { mode: "get_student_rotations", id: response.student_data[0].fields.id}
            let rotation_data = await post_data(payload)
            console.log("response roation data", rotation_data)
           if (response.status === "success") {
               tag("task-message").innerHTML = `
                <div class="user"><h4>Student Details</h4>
                Student ID: ${response.student_data[0].fields.id} &emsp;
                Name: ${response.student_data[0].fields.last_name}, ${response.student_data[0].fields.first_name}<br>
                Degree: Graduate &emsp;
                Class Level: Graduate &emsp;
                Program: Physicians Assistant &emsp;
                Student Email: ${response.student_data[0].fields.Email}</div>`

               let today = new Date().toLocaleDateString()
               const progression = [`<div class="user">
               <h4>Student Progression</h4>
                `]

               for (record of rotation_data.student_data) {
                   if (record.fields.Rotation_End >= today) {
                       
                    progression.push(`<img height="11" src="https://iconape.com/wp-content/png_logo_vector/checkbox-checked.png">&nbsp;${record.fields.specialty_id}&emsp;`)
                   }
                   else{
                    progression.push(`<img height="11" src="https://iconape.com/wp-content/png_logo_vector/checkbox-unchecked.png">&nbsp;${record.fields.specialty_id}&emsp;`)
                   }
               }
               progression.push(`</div>`)
               tag("rotation_panel").innerHTML = progression.join("")

                const header = [`
                <div class="user">
                <h4>Rotation Schedule</h4>
                <table style="width:100%">
                <tr>
                <th>Rotation</th>
                `]
                header.push(`<th>Preceptor</th>`)
                header.push(`<th>Start Date</th>`)
                header.push(`<th>End Date</th>`)
                header.push("</tr>")
                const html = [header.join("")]

                for (record of rotation_data.student_data) {
                    //add a new table row to the table for each flavor
                    html.push("<tr>")
                    html.push(`<td align='center'>${record.fields.specialty_id}</td>`)
                    html.push(`<td align='center'>${record.fields.PreceptorID}</td>`)
                    html.push(`<td align='center'>${record.fields.Rotation_Start}</td>`)
                    html.push(`<td align='center'>${record.fields.Rotation_End}</td>`)
                    html.push("</tr>")
                }

                html.push("</table></div>")
                tag("admin_panel").innerHTML = html.join("")
            } else {
                tag("admin_panel").innerHTML = "Unable to get Data " + response.message
            }
        } else {
            message({
                title: "Confirmation Failure",
                message: `Failed to confirm account: ${response.message}`,
                kind: "error",
                seconds: 5
            })
        }
    } else {
        console.log("invalid process:")
        tag("view_admin_panel").innerHTML = "Failure"
    }

}

