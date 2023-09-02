var globalCategory; // Declaring a global variable to store the class id

// A function to fetch all the items of different categories given in the API link
const loadCategoryItems = async (categoryId = '1000', flag = 0) => {
    const res1 = await fetch('https://openapi.programming-hero.com/api/videos/category/1000');
    const data = await res1.json();
    const categoryItems = data.data;
    console.log(categoryItems);  
    displayCategoryItems(categoryItems, categoryId, flag);
}

loadCategoryItems('1000'); // Initial loading of all categories

// A function to convert given seconds into minutes and hours
function secToMinConversion(seconds) {
    var a = parseInt(seconds);
    var b = 3600;
    var quotient = ~~(a / b);
    var remainder = Math.floor((a % b) / 60);
    if (isNaN(remainder)) {
        remainder = 0;
    }
    return [quotient, remainder];
}

// Displaying all the category items of selected class via generating card.
const displayCategoryItems = (categoryItems, categoryId, flag = 0) => {
    globalCategory = categoryId;
    // console.log(categoryItems);
    // console.log(categoryItems[0]);
    // console.log(typeof categoryId);
    const itemContainer = document.getElementById('item-container');

    // Clear video container before adding new cards
    itemContainer.textContent = '';

    if(flag == 1) {
        categoryItems.sort((a, b) => {
            const viewsA = parseFloat(a.others.views.replace(/[^\d.]/g, '')) || 0; // Extract and convert views to a number
            const viewsB = parseFloat(b.others.views.replace(/[^\d.]/g, '')) || 0; // Extract and convert views to a number
            return viewsB - viewsA;
        });
    }

    categoryItems.forEach(item => {
        console.log(item);
        // console.log(item.category_id);
        if ((item.category_id === categoryId || categoryId === '1000') && categoryId !== '1005') {
            const results = secToMinConversion(item.others.posted_date);
            const hours = results[0];
            const minutes = results[1];
            // console.log(item.others);

            var verifiedOrNot = item.authors[0].verified;
            // console.log(verifiedOrNot);
            var flags = 'hidden';
            if(verifiedOrNot == true) {
                flags = 'block';
            }
            else {
                flags = 'hidden';
            }

            // console.log(item.authors[0].profile_name);
            // 2. create a div
            const itemCard = document.createElement('div');
            itemCard.classList = `card w-50 bg-gray-100 shadow-xl`;
            // 3. Set innerHTML
            itemCard.innerHTML = `
            <figure class="relative">
                <img class="w-full lg:w-[350px] h-[200px]" src="${item.thumbnail}" alt="" />
                <p class="bg-[#171717] text-white absolute p-2 rounded-lg font-light text-[12px] right-4 bottom-4">${hours} hrs ${minutes} min ago</p>
            </figure>
            <div class="flex flex-row mt-4">
                <div class="block">
                    <img src="${item.authors[0].profile_picture}" alt="" class="circular--square thumbnail-img">
                </div>
                <div class="justify-end text-left ml-3">
                    <h2 class="card-title mb-2 font-bold">${item.title}</h2>
                    <p class="mb-1 inline-block pr-1">${item.authors[0].profile_name}</p>
                    <img src="./images/blueTick.svg" class="inline-block ${flags}"/>
                    <p class="pb-4">${item.others.views} views</p>
                </div>
            </div>`;
            // 4. Append child
            itemContainer.appendChild(itemCard);
        }
        const emptyContent = document.getElementById('no-content');
        if(categoryId === '1005') {
            emptyContent.classList.remove('hidden');
        }
        else {
            emptyContent.classList.add('hidden');
        }

    });
}


// Fetching all the category name from the given API
const loadCategory = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const data = await res.json();
    const categories = data.data;
    // console.log(categories);  
    displayCategories(categories);
}

// Initial function cll to load all the category list dynamically from given API
loadCategory();

// Displaying all the category names.
const displayCategories = (displayCategories) => {
    // console.log(displayCategories);

    // 1. Take the position where the created buttons will be added
    const categoryContainer = document.getElementById('btn-category');

    displayCategories.forEach(category => {
        // console.log(category.category);
        // console.log(category.category_id);
        // 2. create a input button
        const categoryCard = document.createElement('button');
        categoryCard.classList = `mx-2 my-3`;
        // 3. Set innerHTML
        categoryCard.innerHTML = `
        <button id="id_${category.category_id}" onclick="loadCategoryItems('${category.category_id}')" class="category-button bg-[#25252526] px-5 py-2 rounded-[4px] hover:bg-[#FF1F3D] hover:text-white">${category.category}</button>`;
        // 4. Append child
        categoryContainer.appendChild(categoryCard);

        // 5. Add a click event listener to the inner button element
        const innerButton = categoryCard.querySelector(`#id_${category.category_id}`);
        innerButton.addEventListener('click', function () {
            // Remove "active-button" class from all buttons
            const allButtons = document.querySelectorAll('.category-button');
            allButtons.forEach(button => {
                button.classList.remove('active-button');
            });

            // Add "active-button" class to the clicked button
            innerButton.classList.add('active-button');

            // Call the loadCategoryItems function with the category_id
            loadCategoryItems(category.category_id);
        });

        // Check if the current category's ID is '1000'
        if (category.category_id === '1000') {
            innerButton.classList.add('active-button');
            loadCategoryItems(category.category_id);
        }
    });

} 

// Working on sorting categories based on views. ${item.others.views} PENDING
function sortCards() {
    const flag = 1;
    loadCategoryItems(globalCategory, flag);
}