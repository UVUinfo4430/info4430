async function admin_data(params) {
    if (!user_has_role(["owner", "manager", "administrator"])) { show_home(); return }
    const panel = tag("view_admin_panel")
    hide_menu()

    if (!params) {
        tag("canvas").innerHTML = ` 
        <div class="page">
            <h2>Please Select The Student That You Would Like To View.</h2>
            <div id="create_account_panel"></div>
        </div>
        `
        if (panel.innerHTML === "") {
            panel.style.display = "block"
            const html = [`
            <form>
                First Name: <input placeholder="Name" name="first_name" id="1234">
                Last Name: <input placeholder="Name" name="last_name"><br>
                ID: <input placeholder="ID" name="ID"><br>
                Type: <select name="type">
                <option value="" selected></option>
                `]
            html.push(`<option value="student">Student</option>`)
            html.push(`</select><br><br>
                    <input type="hidden" name="mode" value="get_student_data">
                    <! -- <input type="hidden" name="confirm" value="${location.href.split("?")[0]}"> -->
                    <button id="create_admin_button" type="button" onclick="admin_data(form_data(this,true))">Search</button>
                </form>   
            `)
            panel.innerHTML = html.join("")
            tag("1234").focus()
        } else {
            toggle(panel)
        }
    } else if (params.button) {
        if (params.button === 'Search') {
            student_data = await post_data(params)
            params.mode = "get_student_rotations"
            rotation_data = await post_data(params)
            console.log("response in get_student_data", response)
           if (response.status === "success") {
                panel.innerHTML = `
                <div class="user">Student Details<br>
                Student ID: ${params.id}
                Name: ${params.last_name}, ${params.first_name}<br></div>

                <div class="user">Student Progression<br>
                </div>

                <div class="user">Student Rotation Schedule<br>
                    <div style="display:block;" >

                                <table class="table">
                                <thead class="tableHead">
                                    <tr class="tableHeaderRow">
                                        <th>Rotation</th>
                                        <th>Preceptor</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                    </tr>
                                </thead>
                                <tbody class="table-Body"></tbody>
                                <tr class="tableBodyRow">
                                    <td>[Rotation Name]</td>
                                    <td>[Task Description]</td>
                                    <td>[ ] </td>
                                    <td>[ ]</td>
                                </tr>
                                </table>
                            </div>
                         </div>`
           } else {
                tag("view_admin_panel").innerHTML = "Unable to get Data " + response.message
                tag("create_admin_button").innerHTML = "Search Students"
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
            console.log("invalid process:", params.button)
           }

}
