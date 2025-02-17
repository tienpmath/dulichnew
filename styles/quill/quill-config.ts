import {StringMap} from "quill";
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.min.css'

import ReactQuill, {Quill} from "react-quill";
import {uploadFile} from "@/lib/image-data";
import {ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE} from "@/enum/enums";

import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

var icons = ReactQuill.Quill.import('ui/icons');
icons['custom-code'] = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-2"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m5 12-3 3 3 3"/><path d="m9 18 3-3-3-3"/></svg>';

hljs.configure({
	languages: ['html', 'css', 'javascript', 'php', 'python', 'typescript'],
})

export const QuillConfig = {
	modules: {
		toolbar: {
			container: [
				['bold', 'italic', 'underline', 'strike'],        // toggled buttons
				['blockquote', 'code-block'],
				['link', 'image', 'video', 'formula'],

				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
				[{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
				[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
				[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
				[{ 'direction': 'rtl' }],                         // text direction

				[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
				[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
				[{ 'font': [] }],
				[{ 'align': [] }],

				['clean', 'custom-code']                                         // remove formatting button
			],
			handlers: {
				'custom-code': function(this: any) {
					if (!this.quill) return

					const tool = document.querySelector('.ql-custom-code')
					const turnOff = tool?.classList.contains('active')

					if(turnOff){
						tool?.classList.remove('active')
						const data = this.quill.getText()
						const delta = this.quill.clipboard.convert(data)
						this.quill.setContents(delta, 'silent')

						return
					}

					tool?.classList.add('active')
					const data = this.quill.root.innerHTML
					this.quill.setText(data)

					return

					// console.log('getContents', this.quill.getContents())
					// console.log('getText', this.quill.getText())

					// const cursorPosition = this.quill.getSelection().index;
					// this.quill.insertText(cursorPosition, '★');
					// this.quill.setSelection(cursorPosition + 1);

					// if (value) {
					// 	const href = prompt('Enter the URL');
					// 	this.quill.format('link', href);
					// } else {
					// 	this.quill.format('link', false);
					// }
				},
				'image': function(this: any){
					const qlImage = document.querySelector('.ql-image')
					if(!qlImage) return

					const qlImageInput: HTMLInputElement | null = document.querySelector('.ql-image-input')
					const loadingImage = 'https://i.giphy.com/3oEjI6SIIHBdRxXI40.webp'
					// const oldRange = qlImage.getAttribute('data-insert-index')

					// if(oldRange){
					// 	this.quill.deleteText(+oldRange, 1)
					//
					// 	qlImage.removeAttribute('data-insert-index')
					// } else{
					// 	const range = this.quill.getSelection();
					// 	this.quill.insertEmbed(range.index, 'image', loadingImage);
					//
					// 	qlImage.setAttribute('data-insert-index', range.index)
					// }
					//

					if(!qlImageInput){
						const inputElement = document.createElement('input');
						inputElement.type = 'file';
						inputElement.accept = ACCEPTED_IMAGE_TYPES.join(',')
						inputElement.classList.add('ql-image-input')

						inputElement.addEventListener('change', async (event) => {
							// @ts-ignore
							const image = event?.target?.files[0]

							if(image.size > MAX_FILE_SIZE) {
								alert("File is too big!");
								return
							}

							const range = this.quill.getSelection();

							// loading
							this.quill.insertEmbed(range.index, 'image', loadingImage);

							// upload image
							const resImage = await uploadFile(image)
							const data = await resImage?.json();

							this.quill.deleteText(range.index, 1)
							this.quill.insertEmbed(range.index, 'image', `${data.secure_url}`);
						});

						inputElement.click()
					} else {
						qlImageInput.click()
					}
				}
			}
		},
		syntax: {
			highlight: text => hljs.highlightAuto(text).value,
		},
		clipboard: {
			matchVisual: false
		},
		imageResize: {
			parchment: Quill.import('parchment'),
			modules: ['Resize', 'DisplaySize']
		}
	}
}

