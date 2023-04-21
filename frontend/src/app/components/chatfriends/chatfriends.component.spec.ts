import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatfriendsComponent } from './chatfriends.component';

describe('ChatfriendsComponent', () => {
  let component: ChatfriendsComponent;
  let fixture: ComponentFixture<ChatfriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatfriendsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatfriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
