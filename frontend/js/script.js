const API_BASE_URL = "http://localhost:8080";

// Helper to format date
function formatDate(dateString) {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper to toggle modals
window.toggleModal = function (modalID) {
    $('#' + modalID).toggleClass("hidden");
}

// Helper to scroll to section with offset for fixed navbar
window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 100; // Adjust for navbar height
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// Admin toast: show success or error message (e.g. "Upload successfully")
function showAdminToast(message, type) {
    type = type || 'success';
    const isSuccess = type === 'success';
    const $toast = $('<div class="admin-toast">')
        .css({
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 99999,
            padding: '14px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: isSuccess ? '#059669' : '#dc2626',
            animation: 'adminToastIn 0.3s ease'
        })
        .html((isSuccess ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>') + ' ' + message);
    $('<style>').text('@keyframes adminToastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }').appendTo('head');
    $('body').append($toast);
    setTimeout(function () {
        $toast.fadeOut(300, function () { $(this).remove(); });
    }, 3000);
}

window.logout = function () {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}

$(document).ready(function () {

    // Check if on admin page
    const isAdminPage = window.location.pathname.includes('admin.html');
    // Check if on homepage (index)
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    if (isAdminPage) {
        if (localStorage.getItem('isAdmin') !== 'true') {
            window.location.href = 'login.html';
        }
    }

    // Initialize Swiper (Hero)
    if ($(".mySwiper").length) {
        window.myHeroSwiper = new Swiper(".mySwiper", {
            spaceBetween: 0,
            effect: "fade",
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }

    // Initialize Swiper (Gallery)
    if ($(".gallerySwiper").length) {
        var gallerySwiper = new Swiper(".gallerySwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
            },
        });
    }

    // Initialize Swiper (Testimonials)
    if ($(".testimonialSwiper").length) {
        var testimonialSwiper = new Swiper(".testimonialSwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.classList.add('py-4');
        }
    });// Mobile Menu Toggle
    $('#mobile-menu-btn').click(function () {
        $('#mobile-menu').toggleClass('hidden');
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // Trigger counter animation when stats section is in view
    let counted = false;
    $(window).scroll(function () {
        const oTop = $('#stats').offset().top - window.innerHeight;
        if (counted == false && $(window).scrollTop() > oTop) {
            animateCounters();
            counted = true;
        }
    });


    // --- NEWS ---
    function loadNews() {
        $.get(API_BASE_URL + "/news", function (data) {
            let html = "";

            // Filter news based on page type
            // On public website (index.html), show all except drafts; on admin, show all
            let filteredNews = isAdminPage ? data : data.filter(news => news.status !== 'Draft');
            // Homepage: latest 3 only
            if (!isAdminPage && isIndexPage) {
                filteredNews = filteredNews
                    .sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0))
                    .slice(0, 3);
            }

            filteredNews.forEach(news => {
                const img = news.imageURL ? `<img src="${news.imageURL}" alt="${news.title}" class="w-full h-40 object-cover transform transition duration-500 hover:scale-105">` : '<div class="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400"><i class="fas fa-image text-3xl"></i></div>';

                // Status Badge
                const statusBadge = news.status === 'Draft'
                    ? '<span class="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Draft</span>'
                    : '<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Published</span>';

                // Category Badge Color
                let categoryColor = "bg-blue-100 text-blue-800";
                if (news.category === 'Notice') categoryColor = "bg-yellow-100 text-yellow-800";
                if (news.category === 'Event') categoryColor = "bg-red-100 text-red-800";
                if (news.category === 'Achievement') categoryColor = "bg-purple-100 text-purple-800";

                html += `
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition duration-300 border border-gray-100">
                        <div class="overflow-hidden relative">
                            ${img}
                            <div class="absolute top-0 right-0 m-2 flex gap-2">
                                <span class="${categoryColor} text-xs font-bold px-3 py-1 rounded shadow-sm">${news.category || 'General'}</span>
                                ${statusBadge}
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex items-center text-sm text-gray-500 mb-3 justify-between">
                                <div class="flex items-center">
                                    <i class="far fa-calendar-alt mr-2 text-school-blue"></i>
                                    <span>${formatDate(news.publishDate)}</span>
                                </div>
                                <div class="text-xs font-medium text-gray-400">
                                    <i class="fas fa-user-edit mr-1"></i> ${news.author || 'Admin'}
                                </div>
                            </div>
                            <h3 class="text-base sm:text-lg md:text-xl font-bold mb-2 text-gray-800 group-hover:text-school-blue transition line-clamp-2">${news.title}</h3>
                            <p class="text-gray-600 line-clamp-3 mb-4 text-xs sm:text-sm">${news.summary || news.content}</p>
                            
                            <div class="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-50">
                                <a href="#" class="read-more-btn text-school-blue font-semibold hover:text-school-gold transition text-xs sm:text-sm flex items-center py-1" data-id="${news.id}">Read More <i class="fas fa-arrow-right ml-1"></i></a>
                                ${isAdminPage ? `
                                <div class="flex gap-2">
                                    <button class="text-blue-400 hover:text-blue-600 edit-news transition p-1" data-id="${news.id}" title="Edit News"><i class="fas fa-edit"></i></button>
                                    <button class="text-red-400 hover:text-red-600 delete-news transition p-1" data-id="${news.id}" title="Delete News"><i class="fas fa-trash"></i></button>
                                </div>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            $("#news-container").html(html || '<p class="text-gray-500 col-span-full text-center py-8">No news yet.</p>');
        }).fail(function (xhr) {
            console.error("Failed to load news", xhr);
            $("#news-container").html('<p class="text-amber-600 col-span-full text-center py-8">Could not load news. Make sure the server is running at ' + API_BASE_URL + '</p>');
        });
    }

    $("#addNewsForm").submit(function (e) {
        e.preventDefault();

        const editId = $(this).data("edit-id");
        const isEditing = editId !== undefined && editId !== null;
        const $btn = $("#addNewsForm button[type='submit']");
        const btnOriginalHtml = $btn.html();

        const newsData = {
            title: $("#newsTitle").val(),
            content: $("#newsContent").val(),
            summary: $("#newsSummary").val(),
            author: $("#newsAuthor").val(),
            category: $("#newsCategory").val(),
            eventDate: $("#newsEventDate").val(),
            publishDate: $("#newsDate").val(),
            imageCaption: $("#newsImageCaption").val(),
            status: $("#newsStatus").val(),
            visibility: $("#newsVisibility").val(),
            active: true
        };

        const formData = new FormData();
        formData.append("news", new Blob([JSON.stringify(newsData)], { type: "application/json" }));

        const fileInput = $("#newsImageFile")[0];
        if (fileInput.files.length > 0) {
            formData.append("file", fileInput.files[0]);
        }

        $btn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Uploading...');

        $.ajax({
            url: isEditing ? API_BASE_URL + "/news/" + editId : API_BASE_URL + "/news",
            type: isEditing ? "PUT" : "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                showAdminToast(isEditing ? "News updated successfully!" : "News saved successfully!", "success");
                toggleModal('newsModal');
                $("#addNewsForm")[0].reset();
                $("#addNewsForm").removeData("edit-id");
                $("#newsModal h3").html('<i class="fas fa-newspaper mr-2"></i> Add News Post');
                $btn.html('<i class="fas fa-save mr-2"></i> Save News Post').prop("disabled", false);
                loadNews();
            },
            error: function (xhr, status, error) {
                console.error("Error saving news:", xhr.responseText);
                alert("Error saving news: " + (xhr.responseText || error));
                $btn.html(btnOriginalHtml).prop("disabled", false);
            },
            complete: function () {
                $btn.prop("disabled", false);
                if ($btn.html().indexOf('fa-spinner') !== -1) $btn.html(btnOriginalHtml);
            }
        });
    });

    // Edit News Handler
    $(document).on("click", ".edit-news", function () {
        const id = $(this).data("id");

        // Fetch the news data
        $.get(API_BASE_URL + "/news/" + id, function (news) {
            // Populate the form with existing data
            $("#newsTitle").val(news.title);
            $("#newsContent").val(news.content);
            $("#newsSummary").val(news.summary || '');
            $("#newsAuthor").val(news.author || '');
            $("#newsCategory").val(news.category || 'General');
            $("#newsEventDate").val(news.eventDate || '');
            $("#newsDate").val(news.publishDate);
            $("#newsImageCaption").val(news.imageCaption || '');
            $("#newsStatus").val(news.status || 'Publish');
            $("#newsVisibility").val(news.visibility || 'Public');

            // Change modal title and button text
            $("#newsModal h3").html('<i class="fas fa-edit mr-2"></i> Edit News Post');
            $("#addNewsForm button[type='submit']").html('<i class="fas fa-save mr-2"></i> Update News Post');

            // Store the news ID for update
            $("#addNewsForm").data("edit-id", id);

            // Open the modal
            toggleModal('newsModal');
        }).fail(function () {
            alert("Failed to load news data for editing.");
        });
    });

    $(document).on("click", ".delete-news", function () {
        const id = $(this).data("id");
        if (confirm("Are you sure you want to delete this news?")) {
            $.ajax({
                url: API_BASE_URL + "/news/" + id,
                type: "DELETE",
                success: function () {
                    loadNews();
                }
            });
        }
    });

    // Read More Button Handler
    $(document).on("click", ".read-more-btn", function (e) {
        e.preventDefault();
        const newsId = $(this).data("id");

        // Fetch full news details
        $.get(API_BASE_URL + "/news/" + newsId, function (news) {
            // Category Badge Color
            let categoryColor = "bg-blue-100 text-blue-800";
            if (news.category === 'Notice') categoryColor = "bg-yellow-100 text-yellow-800";
            if (news.category === 'Event') categoryColor = "bg-red-100 text-red-800";
            if (news.category === 'Achievement') categoryColor = "bg-purple-100 text-purple-800";

            const imageHtml = news.imageURL
                ? `<img src="${news.imageURL}" alt="${news.title}" class="w-full h-36 sm:h-44 md:h-56 lg:h-64 object-cover rounded-lg mb-4 sm:mb-6 shadow-lg">
                   ${news.imageCaption ? `<p class="text-xs sm:text-sm text-gray-500 italic text-center mb-4 sm:mb-6">${news.imageCaption}</p>` : ''}`
                : '';

            const eventDateHtml = news.eventDate
                ? `<div class="flex items-center text-gray-600 mb-2 text-sm sm:text-base">
                       <i class="fas fa-calendar-check mr-2 text-school-blue shrink-0"></i>
                       <span><strong>Event Date:</strong> ${formatDate(news.eventDate)}</span>
                   </div>`
                : '';

            const html = `
                <div class="space-y-4 sm:space-y-6 pt-0 sm:pt-4">
                    <div class="flex items-center gap-2">
                        <span class="${categoryColor} text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wide">${news.category || 'General'}</span>
                    </div>
                    
                    <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-school-blue leading-tight">${news.title}</h2>
                    
                    <div class="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 pb-4 sm:pb-6 border-b-2 border-gray-100">
                        <div class="flex items-center">
                            <i class="far fa-calendar-alt mr-1.5 sm:mr-2 text-school-blue shrink-0"></i>
                            <span><strong>Published:</strong> ${formatDate(news.publishDate)}</span>
                        </div>
                        ${news.author ? `
                        <div class="flex items-center">
                            <i class="fas fa-user-edit mr-1.5 sm:mr-2 text-school-blue shrink-0"></i>
                            <span><strong>By:</strong> ${news.author}</span>
                        </div>
                        ` : ''}
                    </div>

                    ${eventDateHtml}
                    
                    ${imageHtml}
                    
                    ${news.summary ? `<div class="bg-blue-50 border-l-4 border-school-blue p-3 sm:p-5 rounded-r-lg mb-4 sm:mb-6 shadow-sm">
                        <p class="text-sm sm:text-base md:text-lg text-gray-800 font-medium leading-relaxed">${news.summary}</p>
                    </div>` : ''}
                    
                    <div class="text-sm sm:text-base leading-relaxed text-gray-700 max-w-none break-words text-justify">
                        ${news.content.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;

            $("#newsDetailContent").html(html);
            toggleModal('newsDetailModal');
        }).fail(function () {
            alert("Failed to load news details. Please try again.");
        });
    });

    // --- NOTICES (Title + PDF) ---
    function loadNotices() {
        $.get(API_BASE_URL + "/notices", function (data) {
            let html = "";
            let list = data || [];
            // Homepage: latest 3 only
            if (!isAdminPage && isIndexPage) {
                list = list
                    .sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0))
                    .slice(0, 3);
            }
            list.forEach(notice => {
                const pdfLink = notice.pdfUrl
                    ? `<a href="${API_BASE_URL}/notices/${notice.id}/download" download="notice-${notice.id}.pdf" class="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-school-gold/20 text-school-gold rounded-lg hover:bg-school-gold hover:text-school-blue transition font-semibold text-sm"><i class="fas fa-file-pdf"></i> Download PDF</a>`
                    : "";
                const contentHtml = notice.content ? `<p class="text-gray-100 leading-relaxed">${notice.content}</p>` : "";
                if (isAdminPage) {
                    // Admin: white card with visible Delete button
                    const pdfLinkAdmin = notice.pdfUrl
                        ? `<a href="${API_BASE_URL}/notices/${notice.id}/download" download="notice-${notice.id}.pdf" class="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-school-gold/20 text-school-blue rounded-lg hover:bg-school-gold transition font-semibold text-xs"><i class="fas fa-file-pdf"></i> Download PDF</a>`
                        : "";
                    html += `
                        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-school-gold hover:shadow-xl transition duration-300 relative group">
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex items-start flex-1 min-w-0">
                                    <div class="flex-shrink-0 bg-school-gold text-school-blue rounded p-2.5 mr-3">
                                        <i class="fas fa-bullhorn text-lg"></i>
                                    </div>
                                    <div class="flex-grow min-w-0">
                                        <h3 class="text-lg font-bold text-gray-800 mb-1 group-hover:text-school-blue transition">${notice.title}</h3>
                                        <p class="text-gray-500 text-sm mb-2"><i class="far fa-clock mr-1"></i> ${formatDate(notice.publishDate)}</p>
                                        ${pdfLinkAdmin}
                                    </div>
                                </div>
                                <button type="button" class="delete-notice flex-shrink-0 text-red-400 hover:text-red-600 transition p-2 rounded hover:bg-red-50" data-id="${notice.id}" title="Delete Notice"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    `;
                } else {
                    html += `
                    <div class="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg hover:bg-white/20 transition duration-300 relative group">
                        <div class="flex items-start">
                            <div class="flex-shrink-0 bg-school-gold text-school-blue rounded p-3 mr-4">
                                <i class="fas fa-bullhorn text-xl"></i>
                            </div>
                            <div class="flex-grow">
                                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-school-gold transition">${notice.title}</h3>
                                <p class="text-blue-100 text-sm mb-3"><i class="far fa-clock mr-1"></i> ${formatDate(notice.publishDate)}</p>
                                ${contentHtml}
                                ${pdfLink}
                            </div>
                        </div>
                    </div>
                `;
                }
            });
            $("#notices-container").html(html || (isAdminPage ? '<p class="text-gray-500 col-span-full text-center py-8">No notices yet.</p>' : '<p class="text-blue-200 col-span-full text-center py-8">No notices yet.</p>'));
        }).fail(function (xhr) {
            console.error("Failed to load notices", xhr);
            $("#notices-container").html('<p class="text-amber-300 col-span-full text-center py-8">Could not load notices. Is the server running at ' + API_BASE_URL + '?</p>');
        });
    }

    $("#addNoticeForm").submit(function (e) {
        e.preventDefault();
        const noticeData = {
            title: $("#noticeTitle").val(),
            publishDate: $("#noticeDate").val(),
            active: true
        };
        const fileInput = $("#noticePdfFile")[0];
        if (!fileInput.files.length) {
            alert("Please select a PDF file.");
            return;
        }
        const formData = new FormData();
        formData.append("notice", new Blob([JSON.stringify(noticeData)], { type: "application/json" }));
        formData.append("file", fileInput.files[0]);

        const $btn = $("#addNoticeForm button[type='submit']");
        const btnOriginalHtml = $btn.html();
        $btn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Uploading...');

        $.ajax({
            url: API_BASE_URL + "/notices",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                showAdminToast("Notice uploaded successfully!", "success");
                toggleModal('noticeModal');
                $("#addNoticeForm")[0].reset();
                loadNotices();
                $btn.html(btnOriginalHtml).prop("disabled", false);
            },
            error: function (xhr) {
                console.error("Error adding notice:", xhr.responseText);
                alert("Error adding notice: " + (xhr.responseText || "Check server and PDF file."));
                $btn.html(btnOriginalHtml).prop("disabled", false);
            }
        });
    });

    $(document).on("click", ".delete-notice", function () {
        const id = $(this).data("id");
        if (confirm("Are you sure you want to delete this notice?")) {
            $.ajax({
                url: API_BASE_URL + "/notices/" + id,
                type: "DELETE",
                success: function () {
                    loadNotices();
                }
            });
        }
    });


    // --- EVENTS ---
    function loadEvents() {
        $.get(API_BASE_URL + "/events", function (data) {
            let html = "";
            let list = data || [];
            // Homepage: show 3 only
            if (!isAdminPage && isIndexPage) {
                list = list.slice(0, 3);
            }
            list.forEach(event => {
                if (isAdminPage) {
                    // Admin: full layout with delete
                    const imageHtml = event.imageURL ? `<img src="${event.imageURL}" alt="${event.title}" class="w-full h-48 md:w-48 md:h-48 rounded-lg flex-shrink-0 object-cover md:mr-6 mb-4 md:mb-0">` : '<div class="w-full h-48 md:w-48 md:h-48 rounded-lg flex-shrink-0 bg-gray-200 flex items-center justify-center text-gray-400 md:mr-6 mb-4 md:mb-0"><i class="fas fa-image text-4xl"></i></div>';
                    html += `
                        <div class="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center hover:shadow-xl transition duration-300 border-l-8 border-school-blue relative group">
                            ${imageHtml}
                            <div class="flex-grow">
                                <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-school-blue transition">${event.title}</h3>
                            </div>
                            <div class="mt-4 md:mt-0 ml-0 md:ml-4 flex flex-col gap-2">
                                <button class="text-red-400 hover:text-red-600 delete-event transition text-sm" data-id="${event.id}"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    `;
                } else {
                    // Public website: image + "Coming Soon" overlay + title, view only (no click)
                    const imgSrc = event.imageURL || 'https://images.unsplash.com/photo-1540575467063-178bf50e2f0e?w=600';
                    const title = event.title || 'Event';
                    html += `
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden select-none cursor-default pointer-events-none border border-gray-100" style="pointer-events: none;">
                            <div class="relative aspect-[4/3] overflow-hidden">
                                <img src="${imgSrc}" alt="${title}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span class="text-white text-2xl md:text-3xl font-bold tracking-widest uppercase">Coming Soon</span>
                                </div>
                            </div>
                            <div class="p-5">
                                <h3 class="text-xl font-bold text-school-blue">${title}</h3>
                            </div>
                        </div>
                    `;
                }
            });
            if (!html) {
                $("#events-container").html('<p class="text-gray-500 col-span-full text-center py-8">No events yet.</p>');
            } else if (isAdminPage) {
                $("#events-container").html(html);
            } else {
                $("#events-container").html('<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">' + html + '</div>');
            }
        }).fail(function (xhr) {
            console.error("Failed to load events", xhr);
            $("#events-container").html('<p class="text-amber-600 col-span-full text-center py-8">Could not load events. Is the server running at ' + API_BASE_URL + '?</p>');
        });
    }

    $("#addEventForm").submit(function (e) {
        e.preventDefault();

        const eventData = {
            title: $("#eventTitle").val(),
            active: true
        };

        const formData = new FormData();
        formData.append("event", new Blob([JSON.stringify(eventData)], { type: "application/json" }));

        const fileInput = $("#eventImageFile")[0];
        if (fileInput.files.length > 0) {
            formData.append("file", fileInput.files[0]);
        }

        const $btn = $("#addEventForm button[type='submit']");
        const btnOriginalHtml = $btn.html();
        $btn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin mr-2"></i> Uploading...');

        $.ajax({
            url: API_BASE_URL + "/events",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                showAdminToast("Event added successfully!", "success");
                toggleModal('eventModal');
                $("#addEventForm")[0].reset();
                loadEvents();
                $btn.html(btnOriginalHtml).prop("disabled", false);
            },
            error: function (xhr, status, error) {
                console.error("Error adding event:", xhr.responseText);
                alert("Error adding event: " + (xhr.responseText || error));
                $btn.html(btnOriginalHtml).prop("disabled", false);
            }
        });
    });

    $(document).on("click", ".delete-event", function () {
        const id = $(this).data("id");
        if (confirm("Are you sure you want to delete this event?")) {
            $.ajax({
                url: API_BASE_URL + "/events/" + id,
                type: "DELETE",
                success: function () {
                    loadEvents();
                }
            });
        }
    });

    // --- HERO IMAGES ---

    // File Input Change - Update Text Only
    $("#heroImageFile").change(function () {
        const fileCount = this.files.length;
        const fileChosenText = $("#file-chosen");
        if (fileCount > 0) {
            fileChosenText.text(fileCount + " file(s) selected");
        } else {
            fileChosenText.text("No file chosen");
        }
    });

    // Drag and Drop Logic
    const $dropZone = $("#hero-drop-zone");
    const $fileInput = $("#heroImageFile");

    // Prevent default drag behaviors
    $dropZone.on('dragenter dragover dragleave drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // Highlight drop zone
    $dropZone.on('dragenter dragover', function () {
        $(this).addClass('bg-blue-50 border-school-blue').removeClass('bg-gray-50');
    });

    $dropZone.on('dragleave drop', function () {
        $(this).removeClass('bg-blue-50 border-school-blue').addClass('bg-gray-50');
    });

    // Handle dropped files
    $dropZone.on('drop', function (e) {
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            $fileInput[0].files = files; // Assign files to visual input
            $fileInput.trigger('change'); // Trigger change to update text
        }
    });

    function loadHeroImagesAdmin() {
        if (!$("#hero-images-list").length) return;

        $.get(API_BASE_URL + "/hero-images", function (data) {
            let html = "";
            const currentCount = data.length;

            // Disable upload if max reached
            if (currentCount >= 5) {
                $("#heroImageFile").prop("disabled", true);
                $("#uploadHeroBtn").prop("disabled", true).addClass("opacity-50 cursor-not-allowed").text("Limit Reached (5/5)");
            } else {
                $("#heroImageFile").prop("disabled", false);
                $("#uploadHeroBtn").prop("disabled", false).removeClass("opacity-50 cursor-not-allowed").html('<i class="fas fa-upload mr-2"></i> Upload');
            }

            data.forEach(img => {
                html += `
                    <div class="relative group rounded-lg overflow-hidden shadow-md">
                        <img src="${img.imageURL}" class="w-full h-40 object-cover">
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button class="delete-hero-image bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition transform hover:scale-110 shadow-lg" data-id="${img.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            $("#hero-images-list").html(html);
        });
    }

    $("#addHeroImageForm").submit(function (e) {
        e.preventDefault();

        const fileInput = $("#heroImageFile")[0];
        const files = fileInput.files;

        if (files.length === 0) {
            alert("Please select at least one image.");
            return;
        }

        const formData = new FormData();
        // Loop through FileList and append each file
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        $("#uploadHeroBtn").html('<i class="fas fa-spinner fa-spin mr-2"></i> Uploading...').prop("disabled", true);

        $.ajax({
            url: API_BASE_URL + "/hero-images",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                showAdminToast("Images uploaded successfully!", "success");
                $("#addHeroImageForm")[0].reset();
                $("#file-chosen").text("No file chosen");
                loadHeroImagesAdmin();
                $("#uploadHeroBtn").html('<i class="fas fa-upload mr-2"></i> Upload Images').prop("disabled", false);
            },
            error: function (xhr) {
                alert("Error upload: " + xhr.responseText);
                loadHeroImagesAdmin();
                $("#uploadHeroBtn").html('<i class="fas fa-upload mr-2"></i> Upload Images').prop("disabled", false);
            }
        });
    });

    $(document).on("click", ".delete-hero-image", function () {
        if (confirm("Delete this hero image?")) {
            const id = $(this).data("id");
            $.ajax({
                url: API_BASE_URL + "/hero-images/" + id,
                type: "DELETE",
                success: function () {
                    loadHeroImagesAdmin();
                }
            });
        }
    });

    function loadHeroImagesIndex() {
        if (!$(".mySwiper").length) return;

        $.get(API_BASE_URL + "/hero-images", function (data) {
            if (data.length > 0) {
                let slidesHtml = "";
                data.forEach(img => {
                    slidesHtml += `
                        <div class="swiper-slide relative">
                            <img src="${img.imageURL}" alt="School Banner" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-black/50"></div>
                        </div>
                    `;
                });
                // Find the swiper instance and update slides
                // Since we initialize swiper on doc ready, we might need to destroy and re-init or just append slides if possible.
                // Simpler approach: Replace HTML and re-init swiper if needed, or just append slides before init if we call this early.
                // But this is async. 

                const swiperWrapper = $(".mySwiper .swiper-wrapper");
                swiperWrapper.html(slidesHtml);

                // Re-initialize swiper (if it was already initialized, it might look weird, but let's try)
                if (window.myHeroSwiper) {
                    window.myHeroSwiper.destroy(true, true);
                }

                window.myHeroSwiper = new Swiper(".mySwiper", {
                    spaceBetween: 0,
                    effect: "fade",
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                });
            }
        });
    }

    // Initial Load
    loadNews();
    loadNotices();
    loadEvents();
    loadHeroImagesAdmin();
    loadHeroImagesIndex();
});
