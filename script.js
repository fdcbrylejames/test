$(document).ready(function() {
    const API_TOKEN = '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';
    let allRepos = [];

    function fetchRepos() {
        $.ajax({
            url: 'https://api.github.com/users/fdcbrylejames/repos',
            method: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'token ' + API_TOKEN
            },
            success: function(data) {
                console.log(data);
                allRepos = data; // Store the fetched repositories
                // displayRepos(data); // Display repositories initially
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    function fetchRepoContents(repoFullName, fileSlot) {
        $.ajax({
            url: `https://api.github.com/repos/${repoFullName}/contents`,
            method: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'token ' + API_TOKEN
            },
            success: function(data) {
                console.log(data);
                displayRepoContents(data, fileSlot, repoFullName);
            },
            error: function(error) {
                console.log(error);
                fileSlot.html('<p>Unable to fetch repository contents.</p>');
            }
        });
    }

    function displayRepoContents(files, fileSlot, repoFullName) {
        fileSlot.empty(); // Clear previous results
    
        if (!repoFullName) {
            fileSlot.append('<p>No repository found. Please enter a valid repository name.</p>'); // Show message if no repository found
        } else if (files.length === 0) {
            fileSlot.append('<p>No files found in this repository.</p>'); // Show message if no files found
        } else {
            files.forEach(file => {
                const fileItem = $('<div>').addClass('file-item');
                const fileName = $('<span>').text(file.name);
    
                fileItem.append(fileName);
                fileSlot.append(fileItem);
            });
    
            const fileLinkButton = $('<button>').addClass('file-link-button').text('Go to Files');
            fileSlot.append(fileLinkButton);
    
            // Event listener for file link button
            fileLinkButton.click(function() {
                window.open(`https://github.com/${repoFullName}`, '_blank');
            });
        }
    }

    function displayRepos(repos) {
        const repoList = $('#repo-list');
        repoList.empty(); // Clear previous results

        if (repos.length === 0) {
            repoList.append('<p>No matching repositories found.</p>'); // Show message if no repositories found
        } else {
            repos.forEach(repo => {
                const repoItem = $('<div>').addClass('repo-item').hide(); // Hide initially
                const repoName = $('<h2>').addClass('repo-name').text(repo.name);
                const repoDescButton = $('<button>').addClass('desc-button').text('View Description');
                const repoFilesButton = $('<button>').addClass('files-button').text('View Files');
                const repoLabel = $('<span>').addClass('repo-label').text('Repository:');
                const descriptionSlot = $('<div>').addClass('description-slot').hide(); // Hidden initially
                const fileSlot = $('<div>').addClass('file-slot').hide(); // Hidden initially

                repoItem.append(repoLabel, repoName, repoDescButton, repoFilesButton, descriptionSlot, fileSlot);
                repoList.append(repoItem);

                // Event listener for description button
                repoDescButton.click(function() {
                    const repoDescription = repo.description || 'No description available';
                    const repoOwner = repo.owner.login;
                    const repoVisibility = repo.private ? 'Private' : 'Public';
                    const repoCloneUrl = repo.clone_url;
                    const repoCreatedAt = new Date(repo.created_at).toLocaleDateString();

                    const descriptionContent = `
                        <p><strong>Description:</strong> ${repoDescription}</p>
                        <p><strong>Owner:</strong> ${repoOwner}</p>
                        <p><strong>Visibility:</strong> ${repoVisibility}</p>
                        <p><strong>Clone URL:</strong> <a href="${repoCloneUrl}" target="_blank">${repoCloneUrl}</a></p>
                        <p><strong>Created At:</strong> ${repoCreatedAt}</p>
                    `;

                    if (descriptionSlot.is(':visible')) {
                        descriptionSlot.slideUp();
                        repoDescButton.text('View Description'); // Change button text to "View Description"
                    } else {
                        descriptionSlot.html(descriptionContent).slideDown();
                        repoDescButton.text('Hide Description'); // Change button text to "Hide Description"
                    }
                });

                // Event listener for files button
                repoFilesButton.click(function() {
                    if (fileSlot.is(':visible')) {
                        fileSlot.slideUp();
                        repoFilesButton.text('View Files'); // Change button text to "View Files"
                    } else {
                        fetchRepoContents(repo.full_name, fileSlot);
                        fileSlot.slideDown();
                        repoFilesButton.text('Hide Files'); // Change button text to "Hide Files"
                    }
                });
                
                // Slide effect on display
                repoItem.slideDown(500);
                });
                }
                }
                
                function searchRepos(query) {
                const filteredRepos = allRepos.filter(repo =>
                repo.name.toLowerCase().includes(query.toLowerCase())
                );
                displayRepos(filteredRepos);
                }
                
                $('#search-button').click(function() {
                const query = $('#search-bar').val();
                searchRepos(query);
                });
                
                fetchRepos();
                });