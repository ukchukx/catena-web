import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Login from '@/components/Login';


describe('Login', () => {
  it('should set formOK to true if email is valid and password is at least 6 characters', () => {
    const email = 'test@email.com';
    const password = 'password';
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(Login, { localVue, stubs: { RouterLink: RouterLinkStub } });

    expect(wrapper.vm.formOk).toBeFalsy();

    wrapper.setData({ loginForm: { email, password } });

    expect(wrapper.vm.formOk).toBeTruthy();
  });

  it('should disable submit button if formOk is false', () => {
    const email = 'test@email.com';
    const password = 'password';
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(Login, { localVue, stubs: { RouterLink: RouterLinkStub } });
    const submitButton = wrapper.vm.$el.querySelector('button[type="submit"]');

    expect(submitButton.disabled).toBeTruthy();

    wrapper.setData({ loginForm: { email, password } });

    expect(submitButton.disabled).toBeFalsy();
  });

  it('should have "Login" as the submit button text', () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(Login, { localVue, stubs: { RouterLink: RouterLinkStub } });
    const submitButton = wrapper.vm.$el.querySelector('button[type="submit"]');

    expect(submitButton.textContent).toBe('Login');
  });
});
