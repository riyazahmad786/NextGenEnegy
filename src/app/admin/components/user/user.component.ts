import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../admin/services/User.service';
import { HeaderService } from '../../../layout/header/services/header.service';
import { IzDataTableComponent } from '../../../shared/iz-data-table/iz-data-table.component';
import { AppStateService } from '../../../shared/service/app-state.service';
import { TableUtilsService } from '../../../shared/service/table-utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { FacilityService } from '../../services/facility.service';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    IzDataTableComponent,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    MenuComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly facilityService = inject(FacilityService);
  private readonly fb = inject(FormBuilder);
  private readonly tableUtils = inject(TableUtilsService);
  private readonly router = inject(Router);
  isPanelCollapsed = signal(false);
  tableColumns: any[] = [
    //Swati Changes
    { key: 'User Name', label: 'User  Name', sortable: true, hidden: false },
    {
      key: 'EmailAddress',
      label: 'Email Address',
      sortable: true,
      hidden: false,
    },
    { key: 'actions', label: 'Actions', sortable: false, hidden: false }, // Actions column
  ];
  tableData: any[] = [];
  tableActions = [
    { label: '| ', icon: 'fa fa-edit', action: 'edit' },
    { label: ' ', icon: 'fa fa-trash', action: 'delete' },
  ];
  languageOptions = [
    { id: 1, code: 'en', name: 'English' },
    { id: 2, code: 'hi', name: 'Hindi' },
    { id: 3, code: 'es', name: 'Spanish' },
    { id: 4, code: 'fr', name: 'French' },
  ];
  roleOptions = [
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Analytics' },
    { id: 4, name: 'Report User' },
  ];
  pageSize = 10;
  showSearch = true;
  isEditMode = signal(false);
  isViewMode = signal(true);
  userId = signal<number | null>(null);
  facilityOptions = signal<any[]>([]);
  selectedFacilities: string[] = []; // To hold selected facility labels
  isDropdownOpen = false; // To manage dropdown visibility
  filteredFacilities: any[] = []; // To hold filtered facilities based on search
  searchTerm: string = ''; // Property to hold the search term
  userForm!: FormGroup;
  userRole: any;
  isAddNewMode: boolean = false; // Track if in Add New mode
  private storedFacilities: number[] = [];
  @ViewChild('facilityDropdown', { static: false })
  facilityDropdownRef!: ElementRef;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private appState: AppStateService,
    private headerService: HeaderService
  ) {
    this.headerService.isLogin(true);
  }

  ngOnInit() {
    this.userRole = this.appState.getParameter('UserRole') || '';
    this.initForm();
    this.loadFacilities();
    this.loadUsers();
    this.initTableColumns();
    this.userForm.disable();
    this.userForm.get('password')?.valueChanges.subscribe(() => {
      if (this.userForm.get('confirmPassword')?.value) {
        this.userForm.updateValueAndValidity();
      }
    });
    this.userForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      if (this.userForm.get('password')?.value) {
        this.userForm.updateValueAndValidity();
      }
    });
  }
  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent immediate close after open
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  shouldShowAdminLink(): boolean {
    return ['Super Admin'].includes(this.userRole);
  }

  initForm() {
    this.userForm = this.fb.group(
      {
        userName: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co|info|org|net|edu|gov|mil)$/
            ),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required],
        mobile: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)],
        ],
        language: ['', Validators.required],
        facilities: ['', Validators.required],
        roles: [4, Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    this.userForm.disable();
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.isDropdownOpen) {
      return;
    }
    const clickedInside = this.facilityDropdownRef?.nativeElement.contains(
      event.target
    );
    if (!clickedInside) {
      this.isDropdownOpen = false;
      this.cdRef.detectChanges();
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private initTableColumns() {
    const allowedColumns = ['UserID', 'UserName', 'EmailAddress'];
    this.tableColumns = this.tableUtils.generateTableColumns(
      allowedColumns,
      ['UserName', 'EmailAddress'],
      ['UserID']
    );
  }

  loadFacilities() {
    const userId = this.appState.getParameter('userId') || 1;
    this.userService.getFacilities(userId).subscribe({
      next: (response: any) => {
        console.log('API response:', response);
        if (response?.Table?.length) {
          this.facilityOptions.set(
            response.Table.map((facility: any) => ({
              value: facility.FacilitiesID, // note: also adjust field name here
              label: facility.FacilityName,
            }))
          );
          this.filteredFacilities = this.facilityOptions(); // Initialize filtered facilities
        } else {
          console.log('No facilities found in response.');
        }
      },
      error: (err) => {
        console.error('Error loading facilities:', err);
      },
    });
  }
  filterFacilities(searchTerm: string) {
    const term = searchTerm.toLowerCase();
    this.filteredFacilities = this.facilityOptions().filter((facility) =>
      facility.label.toLowerCase().includes(term)
    );
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        if (response?.Table?.length) {
          //Swati changes
          this.tableData = response.Table.map((user: any) => ({
            UserName: user.UserName,
            EmailAddress: user.EmailAddress,
            UserID: user.UserID, // Assuming UserID is needed for actions
          }));
        } else {
          this.tableData = [];
        }
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  onSubmit() {
    console.log('Form Status:', this.userForm.status); // Debug
    this.passwordMatchValidator;
    this.markAllAsTouched();
    const formValue = this.userForm.value;
    const roleName = this.getRoleNameById(formValue.roles);
    const isAdmin = roleName === 'Admin';
    if (this.userForm.invalid) {
      return; // Exit the method if the form is invalid
    }
    const facilityValue = isAdmin ? null : formValue.facilities.join(',');
    const userData = {
      UserName: formValue.userName,
      Password: formValue.password || undefined,
      FacilityID: facilityValue, // Taking first facility for simplicity
      MobileNumber: formValue.mobile,
      EmailAddress: formValue.email,
      DisplayLanguage: formValue.language,
      RoleID: formValue.roles.toString(),
    };
    if (this.isEditMode()) {
      this.updateUser(userData);
    } else {
      this.addUser(userData);
    }
    this.isAddNewMode = true; // Set to not Add New mode after submission
  }

  onRoleChange(event: Event, roleId: number, roleName: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.userForm.get('roles')?.setValue(roleId);
      if (roleName === 'Analytics') {
        if (this.storedFacilities.length > 0) {
          this.userForm.get('facilities')?.setValue(this.storedFacilities);
          this.updateSelectedFacilitiesLabels(this.storedFacilities);
        }
        this.userForm.get('facilities')?.enable();
      } else if (roleName === 'Admin') {
        const currentFacilities = this.userForm.get('facilities')?.value || [];
        this.storedFacilities = [...currentFacilities];
        this.userForm.get('facilities')?.setValue([]);
        this.selectedFacilities = [];
        this.userForm.get('facilities')?.disable();
      } else if (roleName === 'Report User') {
        if (this.storedFacilities.length > 0) {
          this.userForm.get('facilities')?.setValue(this.storedFacilities);
          this.updateSelectedFacilitiesLabels(this.storedFacilities);
        }
        this.userForm.get('facilities')?.enable();
      }
    }
    this.cdRef.detectChanges();
  }

  private updateSelectedFacilitiesLabels(facilityIds: number[]) {
    this.selectedFacilities = facilityIds
      .map((id) => {
        const found = this.facilityOptions().find((f) => f.value === id);
        return found ? found.label : null;
      })
      .filter((label) => label !== null) as string[];
  }

  private markAllAsTouched() {
    Object.values(this.userForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  onFacilityChange(event: Event, facilityId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const facilities = this.userForm.get('facilities')?.value || [];
    if (isChecked) {
      this.userForm.get('facilities')?.setValue([...facilities, facilityId]);
      this.storedFacilities = [...this.storedFacilities, facilityId];
      const label = this.facilityOptions().find(
        (f) => f.value === facilityId
      )?.label;
      if (label && !this.selectedFacilities.includes(label)) {
        this.selectedFacilities.push(label);
      }
    } else {
      const updatedFacilities = facilities.filter(
        (id: number) => id !== facilityId
      );
      this.userForm.get('facilities')?.setValue(updatedFacilities);
      this.storedFacilities = this.storedFacilities.filter(
        (id) => id !== facilityId
      );
      const label = this.facilityOptions().find(
        (f) => f.value === facilityId
      )?.label;
      this.selectedFacilities = this.selectedFacilities.filter(
        (l) => l !== label
      );
    }
    this.cdRef.detectChanges();
  }

  selectAllFacilities(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const allFacilityIds = this.facilityOptions().map(
      (facility) => facility.value
    );
    if (isChecked) {
      this.userForm.get('facilities')?.setValue(allFacilityIds);
      this.selectedFacilities = this.facilityOptions().map(
        (facility) => facility.label
      );
    } else {
      this.userForm.get('facilities')?.setValue([]);
      this.selectedFacilities = [];
    }
  }
  private switchToViewMode(row: any) {
    this.isViewMode.set(true);
    this.isEditMode.set(false);
    this.userForm.disable();
    if (row) {
      this.editUser(row);
      this.userForm.disable();
    }
  }
  addUser(userData: any) {
    this.userService.saveUser(userData).subscribe({
      next: (response) => {
        alert('User added successfully!');
        this.resetForm();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error adding user:', err);
        alert('Failed to add user. Please try again.');
      },
    });
  }

  updateUser(userData: any) {
    if (!this.userId()) return;
    this.userService.updateUser(this.userId()!, userData).subscribe({
      next: (response) => {
        alert('User updated successfully!');
        this.resetForm();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user. Please try again.');
      },
    });
  }

  handleAction(event: { action: string; row: any } | Event) {
    if ('action' in event && 'row' in event) {
      const customEvent = event as { action: string; row: any };
      switch (customEvent.action) {
        case 'edit':
          this.editUser(customEvent.row.UserID);
          break;
        case 'delete':
          this.deleteUser(customEvent.row.UserID);
          break;
      }
    } else {
      console.warn('Received generic event:', event);
    }
  }
  getLanguageNameById(id: number): string {
    const lang = this.languageOptions.find((l) => l.id === id);
    return lang ? lang.name : 'Unknown';
  }

  editUser(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user: any) => {
        if (user?.Table?.length) {
          const userData = user.Table[0]; // Assuming the data comes in Table[0]
          this.userId.set(userId);
          this.isEditMode.set(true);
          this.isAddNewMode = true;
          const roleId = Number(userData.RoleID);
          const roleName = this.getRoleNameById(roleId);
          const isAdmin = roleName === 'Admin';
          const facilities = isAdmin
            ? []
            : userData.FacilityID.split(',').map(Number);
          this.userForm.patchValue({
            userName: userData.UserName,
            email: userData.EmailAddress,
            mobile: userData.MobileNumber,
            language: userData.DisplayLanguage,
            facilities: facilities, // Assuming single facility selection
            roles: roleId, // Set roleId directly
            password: userData.Password,
            confirmPassword: userData.Password,
          });
          this.loadFacilities(); // Fetch facilities
          this.cdRef.detectChanges();
          this.enableFormForEditing();
        }
      },
      error: (err) => {
        console.error('Error loading user:', err);
        alert('Failed to load user data for editing');
      },
    });
  }

  get isFacilityDisabled(): boolean {
    const roleId = this.userForm.get('roles')?.value;
    const roleName = this.getRoleNameById(roleId);
    return roleName === 'Admin';
  }

  getRoleNameById(roleId: number): string {
    const role = this.roleOptions.find((r) => r.id === roleId);
    return role ? role.name : 'Unknown';
  }
  get adminRoleId(): number | undefined {
    return this.roleOptions.find((role) => role.name === 'Admin')?.id;
  }

  private enableFormForEditing() {
    this.userForm.enable();
  }
  viewUser(userId: number) {
    this.loadUsers();
    console.log('View user:', userId);
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.userForm.disable();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user. Please try again.');
        },
      });
    }
  }

  resetForm() {
    //Swati Changes
    this.isAddNewMode = false;
    this.userForm.reset({
      facilities: [],

      roles: 4, // Set default role to Report User
    });
    this.isEditMode.set(false);
    this.userId.set(null);
    this.userForm.enable(); // Re-enable form
    this.userForm.get('facilities')?.enable();
    this.userForm.get('roles')?.enable();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
  }

  onClear() {
    //Swati Changes
    const roleId = this.userForm.get('roles')?.value;
    const roleName = this.getRoleNameById(roleId);
    if (this.isEditMode() && this.userForm.dirty) {
      if (confirm('Discard changes?')) {
        this.resetForm();
        this.userForm.enable();
        this.isEditMode.set(false);
      }
    } else {
      this.resetForm();
      this.isAddNewMode = true;
      this.userForm.enable();
      this.isEditMode.set(false);
    }
  }
}
