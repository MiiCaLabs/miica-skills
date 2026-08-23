# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

Code Samples

-   CRM APIs
    -   Get Current User

        const currentUser \= await zrc.get("/crm/v8/users?type=CurrentUser"); console.log(currentUser.data);

    -   Get All Leads (Promise Style)

        zrc.get('/crm/v8/Leads', { params: { fields: 'Last\_Name,First\_Name' } }).then(res \=> { console.log(res.data.data); }).catch (err \=> { console.error("Error fetching leads:", err); });

    -   Create a Lead

        const leadData \= { data: \[{ Last\_Name: "Doe", Company: "Acme Corp", Email: "johndoe@example.com" }\] }; const newLead \= await zrc.post("/crm/v8/Leads", leadData); console.log(newLead.data);

    -   Get Notes Related to a Record

        const res \= await zrc.get("/crm/v8/Leads/4000001234567/Notes"); console.log(res.data);

    -   Update Deal Stage

        const updateStage \= await zrc.put("/crm/v8/Deals/400000112233", { data: \[{ Stage: "Closed Won" }\] }); console.log(updateStage.data);

    -   Update a Contact

        const contactId \= "4000000012345"; // replace with actual ID const updateContact \= await zrc.put(\`/crm/v8/Contacts/${contactId}\`, { data: \[{ First\_Name: "UpdatedName" }\] }); console.log(updateContact.data);

    -   Delete a Deal

        const dealId \= "4000000012345"; // replace with actual ID const deleteRes \= await zrc.delete(\`/crm/v8/Deals/${dealId}\`); console.log(deleteRes.data);

    -   Run COQL Query

        const query \= { select\_query: "select Last\_Name, Email from Leads where Email like '%@example.com'" }; const coqlRes \= await zrc.post("/crm/v8/coql", query); console.log(coqlRes.data.data);

    -   Execute CRM Function with request payload (POST)

        // 'my\_function' is the api name of the function. // oauth2 should be enabled for 'my\_function' in Zoho CRM functions setup page. const function\_response \= zrc.post('/crm/v7/functions/my\_function/actions/execute?auth\_type=oauth', { 'payload': 'json\_body' }); // body can be received in Deluge function with 'crmAPIRequest.get('body')' // crmAPIRequest should be declared as Map type argument in the Deluge function. console.log(function\_response.data.details.output); // Function output will be in details.output key

    -   Execute CRM Function with query params (GET)

        const function\_response \= zrc.get('/crm/v7/functions/my\_function/actions/execute?auth\_type=oauth', { params: { 'query': 'value1' } }); // query params can be received in Deluge function with 'crmAPIRequest.get('params')' // crmAPIRequest should be declared as Map type argument in the Deluge function. console.log(function\_response.data.details.output); // Function output will be in details.output key

    -   Get Count of Records with Search Criteria

        const res \= await zrc.get("/crm/v8/Contacts/search", { params: { criteria: '(Email:contains:@example.com)' } }); console.log("Total:", res.data.info.count);

    -   Upload File as Attachment to a Lead

        const formData \= new FormData(); formData.append("file", fileBlob, "resume.pdf"); const uploadRes \= await zrc.post("/crm/v8/Leads/4000001234567/Attachments", formData); console.log(uploadRes.data);

    -   Download Attachment from Contact

        const attachmentRes \= await zrc.get("/crm/v8/Contacts/4000001234567/Attachments/4000007654321", { responseType: "blob" }); console.log(attachmentRes.data);

-   Connections
    -   Get ticket details from Zoho Desk

        const result \= await zrc.get('https://desk.zoho.com/api/v1/tickets', { connection: 'zoho\_desk' }); console.log(result.data);

    -   Create Ticket in Zoho Desk

        const res \= await zrc.post('https://desk.zoho.com/api/v1/tickets', { subject: "CRM Lead Conversion - Support Ticket", departmentId: "1234567890000123456", // Replace with Desk Dept ID contactId: "1234567890000654321", // Replace with Desk Contact ID description: "This ticket was auto-created from Zoho CRM via ZRC", priority: "High", status: "Open" }, { connection: "zoho\_desk" }); console.log(res.data);

    -   Upload File to WorkDrive

        try{ const folderId \= "nxvdo037db1ab668f49698309d397cf1958d8"; const path \= "https://zohoapis.com/workdrive/api/v1/upload"; const imageDownloadResponse \= await zrc.get("https://picsum.photos/150", { responseType: "blob", }); console.info({ imageDownloadResponse }); const imageBlob \= imageDownloadResponse.data; const formData \= new FormData(); formData.append("filename", imageBlob.name || "my-random-image.jpeg"); formData.append("override-name-exist", "true"); formData.append("parent\_id", folderId); formData.append("content", imageBlob); const uploadRes \= await zrc.post(path, formData, { connection: "workdrive" }); console.info({ uploadRes }); } catch (error){ console.error({ error }); }

-   External APIs
    -   Call External API (Public)

        const external \= await zrc.get("https://zylker.com/posts"); console.log(external.data);

    -   Use zrc.request to POST External API

        const res \= await zrc.request({ method: "post", path: "https://zylker.com/posts", body: { title: "My Title", body: "My Content" } }); console.log(res.data);

    -   Use zrc.createInstance for Custom Base URL

        const api \= zrc.createInstance({ baseUrl: "https://api.example.com" }); const users \= await api.get("/users"); console.log(users.data);
