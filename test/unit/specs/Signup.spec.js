import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Signup from '@/components/Signup';

describe('Signup', () => {
  it('should set formOK to true if email is valid and password is at least 6 characters', () => {
    const email = 'test@email.com';
    const password = 'password';
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(Signup, { localVue, stubs: { RouterLink: RouterLinkStub } });
    wrapper.setData({ signupForm: { email: '', password: '' } });

    expect(wrapper.vm.formOk).toBeFalsy();

    wrapper.setData({ signupForm: { email, password } });

    expect(wrapper.vm.formOk).toBeTruthy();
  });

  it('should disable submit button if formOk is false', () => {
    const email = 'test@email.com';
    const password = 'password';
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(Signup, { localVue, stubs: { RouterLink: RouterLinkStub } });
    wrapper.setData({ signupForm: { email: '', password: '' } });

    const submitButton = wrapper.vm.$el.querySelector('button[type="submit"]');

    expect(submitButton.disabled).toBeTruthy();

    wrapper.setData({ signupForm: { email, password } });

    expect(submitButton.disabled).toBeFalsy();
  });

  it('should have "Signup" as the submit button text', () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = mount(Signup, { localVue, stubs: { RouterLink: RouterLinkStub } });
    const submitButton = wrapper.vm.$el.querySelector('button[type="submit"]');

    expect(submitButton.textContent).toBe('Signup');
  });
});

