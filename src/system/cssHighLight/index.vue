<template>
    <label>Search within text <input id="query" type="text" /></label>
    <article>
        <p>
            Maxime debitis hic, delectus perspiciatis laborum molestiae labore,
            deleniti, quam consequatur iure veniam alias voluptas nisi quo. Dolorem
            eaque alias, quo vel quas repudiandae architecto deserunt quidem, sapiente
            laudantium nulla.
        </p>
        <p>
            Maiores odit molestias, necessitatibus doloremque dolor illum reprehenderit
            provident nostrum laboriosam iste, tempore perferendis! Ab porro neque esse
            voluptas libero necessitatibus fugiat, ex, minus atque deserunt veniam
            molestiae tempora? Vitae.
        </p>
        <p>
            Dolorum facilis voluptate eaque eius similique ducimus dignissimos assumenda
            quos architecto. Doloremque deleniti non exercitationem rerum quam alias
            harum, nisi obcaecati corporis temporibus vero sapiente voluptatum est
            quibusdam id ipsa.
        </p>
        <p>Lorem ipsum dolor sit.
            Eius incidunt fuga laborum?
            Cum asperiores beatae vero!</p>
    </article>
</template>

<script setup>
import { onMounted } from 'vue'
const str = ('bcdaerghjkyw').split('');
function bubbleSort(str) {  
for (let i=0;i<str.length-1;i++){
    for(let j=0;j<str.length-i-1;j++){
       if(str[j]>str[j+1]) {
        let temp = str[j]
        str[j]=str[j+1]
        str[j+1]=temp}
    }
        
}
return str;
}
function mergeSort(arr) {  // 采用自上而下的递归方法
    var len = arr.length;
    if(len < 2) {
        return arr;
    }
    var middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right)
{
    var result = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}  
console.log(bubbleSort(str));
console.log(mergeSort(str));
// 所有DOM相关操作放到onMounted中，确保模板渲染完成
onMounted(() => {
    const query = document.getElementById("query");
    const article = document.querySelector("article");

    // Find all text nodes in the article. We'll search within
    // these text nodes.
    const treeWalker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
    console.log(treeWalker);
    const allTextNodes = [];
    let currentNode = treeWalker.nextNode();
    while (currentNode) {
        allTextNodes.push(currentNode);
        currentNode = treeWalker.nextNode();
    }
    console.log(allTextNodes);
    // Listen to the input event to run the search.
    query.addEventListener("input", () => {
        // If the CSS Custom Highlight API is not supported,
        // display a message and bail-out.
        if (!CSS.highlights) {
            article.textContent = "CSS Custom Highlight API not supported.";
            return;
        }

        // Clear the HighlightRegistry to remove the
        // previous search results.
        CSS.highlights.clear();

        // Clean-up the search query and bail-out if
        // if it's empty.
        const str = query.value.trim();
        if (!str) {
            return;
        }

        // Iterate over all text nodes and find matches.
        const ranges = allTextNodes
            .map((el) => {
                return { el, text: el.textContent };
            })
            .map(({ text, el }) => {
                const indices = [];
                let startPos = 0;
                while (startPos < text.length) {
                    const index = text.indexOf(str, startPos);
                    if (index === -1) break;
                    indices.push(index);
                    startPos = index + str.length;
                }

                // Create a range object for each instance of
                // str we found in the text node.
                return indices.map((index) => {
                    const range = new Range();
                    range.setStart(el, index);
                    range.setEnd(el, index + str.length);
                    return range;
                });
            });

        // Create a Highlight object for the ranges.
        const searchResultsHighlight = new Highlight(...ranges.flat());

        // Register the Highlight object in the registry.
        CSS.highlights.set("search-results", searchResultsHighlight);
    });
})
</script>

<style>
::highlight(search-results) {
    background-color: #f06;
    color: white;
}
</style>