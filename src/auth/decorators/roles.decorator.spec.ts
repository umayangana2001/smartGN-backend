import { Role } from '../enums';
import { Roles, ROLES_KEY } from './roles.decorator';

describe('Roles Decorator', () => {
  it('should export ROLES_KEY constant', () => {
    expect(ROLES_KEY).toBe('roles');
  });

  it('should export Roles function', () => {
    expect(typeof Roles).toBe('function');
  });

  it('should create decorator with single role', () => {
    const decorator = Roles(Role.USER);
    expect(typeof decorator).toBe('function');
  });

  it('should create decorator with multiple roles', () => {
    const decorator = Roles(Role.USER, Role.ADMIN, Role.VILLAGE_OFFICER);
    expect(typeof decorator).toBe('function');
  });

  it('should apply metadata to class', () => {
    @Roles(Role.USER)
    class TestController {}

    const metadata = Reflect.getMetadata(ROLES_KEY, TestController);
    expect(metadata).toEqual([Role.USER]);
  });

  it('should apply metadata with multiple roles to class', () => {
    @Roles(Role.USER, Role.ADMIN)
    class TestController {}

    const metadata = Reflect.getMetadata(ROLES_KEY, TestController);
    expect(metadata).toEqual([Role.USER, Role.ADMIN]);
  });

  it('should apply metadata with VILLAGE_OFFICER role', () => {
    @Roles(Role.VILLAGE_OFFICER)
    class TestController {}

    const metadata = Reflect.getMetadata(ROLES_KEY, TestController);
    expect(metadata).toEqual([Role.VILLAGE_OFFICER]);
  });

  it('should apply metadata with all three roles', () => {
    @Roles(Role.USER, Role.VILLAGE_OFFICER, Role.ADMIN)
    class TestController {}

    const metadata = Reflect.getMetadata(ROLES_KEY, TestController);
    expect(metadata).toHaveLength(3);
    expect(metadata).toContain(Role.USER);
    expect(metadata).toContain(Role.VILLAGE_OFFICER);
    expect(metadata).toContain(Role.ADMIN);
  });
});
