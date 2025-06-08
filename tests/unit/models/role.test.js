import Role from '@models/role'

describe('[Models] Role', () => {
    it('[Should] contain all expected roles', () => {
        expect(Role.User).toBe('User')
        expect(Role.Student).toBe('Student')
        expect(Role.SLB).toBe('SLB')
        expect(Role.ModuleAdmin).toBe('ModuleAdmin')
        expect(Role.SystemAdmin).toBe('SystemAdmin')
    })

    it('[Should] not have unexpected roles', () => {
        expect(Object.keys(Role)).toEqual([
            'User',
            'Student',
            'SLB',
            'ModuleAdmin',
            'SystemAdmin'
        ])
    })

    it('[Should] have unique values for each role', () => {
        const values = Object.values(Role)
        const uniqueValues = new Set(values)
        expect(uniqueValues.size).toBe(values.length)
    })
})