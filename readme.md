# GitHub TOC Sidebar

Show GitHub README TOC as a sidebar 

![](images/screenshot-0.png)


This is how it works:

![](images/screenshot-1.png)

Install it on [Chrome Web Store](https://chrome.google.com/webstore/detail/github-toc-sidebar/cdiiikhamhampcninkmmpgejjbgdgdnn)


## Features

- Automatically display the native README TOC on the right side while scrolling down.
- Hide the README TOC after the sidebar shows up when you scroll up

> **Note**
> 1. This extension is designed solely to enhance the browsing experience for GitHub README.
>     If you need a universal TOC extension, please refer to other options such as Smart TOC or Simple Outliner.
> 2. This extension utilizes the native README TOC provided by GitHub,
>    which makes it look beautiful and easy to implement.


## Thing you should know

Please note that this extension only works when all the circumstances are met:
1. You are viewing the home page of a project on GitHub, meaning that the URL must match the format https://github.com/<user>/<project>, not subsidiary pages like https://github.com/<user>/<project>/blob/master/readme.md
2. The project has a readme file written in a markup language such as Markdown or RST
3. The readme file has headings that split content into multiple sections with titles
4. You scroll down the page further than the bottom of the right sidebar

To test if this extension works, you can open this page as an example: https://github.com/reorx/awesome-chatgpt-api


## Configuration

I haven't added any configurations since it totally fulfills my need.
However, I have considered options such as being able to customize the width and height of the TOC,
or even making it movable.

If you would like to suggest and contribute these features,
please feel free to send a pull request or create a detailed issue explaining your requirements and design suggestions.
