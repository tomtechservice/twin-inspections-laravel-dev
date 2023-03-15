import { Component, OnInit, ElementRef } from '@angular/core';


@Component({
  selector: 'intake-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  
})
export class HeaderComponent implements OnInit {
  el;
  constructor(el: ElementRef) { 
    this.el = el.nativeElement
  }

  ngOnInit() {
  }

  openCity(event: any,contName) {
    var i, tabContent, tabLinks;
    tabContent = this.el.getElementsByClassName('tabcontent');
    tabLinks = this.el.getElementsByClassName('tablinks');
    
    // Get all elements with class="tabcontent" and hide them
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tabLinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(contName).style.display = "block";
    event.target.classList.add('active'); // To ADD
     
  }

}
